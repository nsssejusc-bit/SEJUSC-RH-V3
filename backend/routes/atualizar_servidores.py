from flask import jsonify, request, Blueprint
from conection_mysql import connect_mysql
from flask_login import current_user

bp_atualizar_servidor = Blueprint('bp_atualizar_servidor', __name__)

HORARIO_FIELDS = ["horarioentrada", "horariosaida"]

def normalizar_horario(valor):
    """
    Recebe HH:MM ou HH:MM:SS e retorna HH:MM
    """
    if not valor:
        return None
    return str(valor)[:5]


@bp_atualizar_servidor.route('/api/servidores/<int:id>', methods=['PATCH'])
def atualizar_servidor(id):
    conexao = None
    cursor = None

    try:
        conexao = connect_mysql()
        cursor = conexao.cursor(dictionary=True)
        body = request.json or {}

        # ---------------------------------------------------------
        # VERIFICA SE EXISTE
        # ---------------------------------------------------------
        cursor.execute("SELECT nome FROM funcionarios WHERE id = %s", (id,))
        servidor = cursor.fetchone()

        if not servidor:
            return jsonify({'erro': 'Servidor não encontrado'}), 404

        nome_servidor = servidor['nome']

        # ---------------------------------------------------------
        # 1) BENEFICIÁRIOS
        # ---------------------------------------------------------
        if isinstance(body.get('beneficiarios'), list):
            for ben in body['beneficiarios']:
                ben_id = ben.get('id')

                if ben_id and ben.get('deletar') is True:
                    cursor.execute(
                        "DELETE FROM beneficiarios WHERE id = %s AND funcionario_id = %s",
                        (ben_id, id)
                    )

                elif ben_id:
                    campos = {
                        k: v for k, v in ben.items()
                        if k in ('nome', 'parentesco', 'data_nascimento')
                    }
                    if campos:
                        set_clause = ', '.join(f"{k} = %s" for k in campos)
                        cursor.execute(
                            f"""
                            UPDATE beneficiarios
                            SET {set_clause}
                            WHERE id = %s AND funcionario_id = %s
                            """,
                            list(campos.values()) + [ben_id, id]
                        )

                elif not ben_id and ben.get('nome'):
                    cursor.execute("""
                        INSERT INTO beneficiarios
                        (nome, parentesco, data_nascimento, funcionario_id)
                        VALUES (%s, %s, %s, %s)
                    """, (
                        ben.get('nome'),
                        ben.get('parentesco'),
                        ben.get('data_nascimento'),
                        id
                    ))

        # ---------------------------------------------------------
        # 2) CAMPOS DO SERVIDOR
        # ---------------------------------------------------------
        campos_permitidos = [
            'secretaria_lotacao', 'nome', 'matricula', 'cargo', 'funcao',
            'horarioentrada', 'horariosaida',
            'feriasinicio', 'feriasfinal',
            'data_nascimento', 'sexo', 'estado_civil', 'naturalidade',
            'nacionalidade', 'identidade', 'titulo_eleitor', 'cpf', 'pis',
            'data_Admissao', 'endereco', 'nome_pai', 'nome_mae',
            'servico_militar', 'carteira_profissional', 'data_posse',
            'data_desligamento', 'inicio_atividades', 'descanso_semanal',
            'vencimento_ou_salario', 'vinculo', 'curso', 'pdc',
            'outras_anotacoes'
        ]

        # Compatibilidade frontend antigo
        if 'setor' in body and 'secretaria_lotacao' not in body:
            body['secretaria_lotacao'] = body.pop('setor')

        campos_update = {}

        for campo in campos_permitidos:
            if campo in body:
                valor = body[campo]

                if campo in HORARIO_FIELDS:
                    valor = normalizar_horario(valor)

                campos_update[campo] = valor

        # ---------------------------------------------------------
        # 2.1) MONTA O CAMPO "horario" DIRETO DO FRONT
        # ---------------------------------------------------------
        entrada_front = body.get('horarioentrada')
        saida_front   = body.get('horariosaida')

        if entrada_front and saida_front:
            entrada_hhmm = normalizar_horario(entrada_front)
            saida_hhmm   = normalizar_horario(saida_front)

            campos_update['horario'] = f"{entrada_hhmm} AS {saida_hhmm}"

        if campos_update:
            set_clause = ', '.join(f"{k} = %s" for k in campos_update)
            cursor.execute(
                f"""
                UPDATE funcionarios
                SET {set_clause}
                WHERE id = %s
                """,
                list(campos_update.values()) + [id]
            )

        # ---------------------------------------------------------
        # 3) TRANSFERÊNCIAS
        # ---------------------------------------------------------
        if isinstance(body.get('transferencias'), list):
            cursor.execute(
                "DELETE FROM funcionario_transferencias WHERE funcionario_id = %s",
                (id,)
            )

            for t in body['transferencias']:
                if t.get('data_transferencia') or t.get('de_lotacao') or t.get('para_lotacao'):
                    cursor.execute("""
                        INSERT INTO funcionario_transferencias
                        (funcionario_id, data_transferencia, de_lotacao, para_lotacao)
                        VALUES (%s, %s, %s, %s)
                    """, (
                        id,
                        t.get('data_transferencia'),
                        t.get('de_lotacao'),
                        t.get('para_lotacao')
                    ))

        # ---------------------------------------------------------
        # 4) FÉRIAS
        # ---------------------------------------------------------
        if isinstance(body.get('ferias'), list):
            cursor.execute(
                "DELETE FROM funcionario_ferias WHERE funcionario_id = %s",
                (id,)
            )

            for f in body['ferias']:
                if f.get('periodo_aquisicao') or f.get('periodo_utilizacao'):
                    cursor.execute("""
                        INSERT INTO funcionario_ferias
                        (funcionario_id, periodo_aquisicao, periodo_utilizacao)
                        VALUES (%s, %s, %s)
                    """, (
                        id,
                        f.get('periodo_aquisicao'),
                        f.get('periodo_utilizacao')
                    ))

        # ---------------------------------------------------------
        # 5) LOG
        # ---------------------------------------------------------
        usuario = getattr(current_user, 'username', 'Sistema')
        cursor.execute("""
            INSERT INTO historico_logs (mensagem, acao, nome, data_criacao)
            VALUES (%s, 'Atualizar', %s, NOW())
        """, (
            f"O usuário {usuario} atualizou o servidor {nome_servidor}",
            nome_servidor
        ))

        conexao.commit()
        return jsonify({'mensagem': 'Servidor atualizado com sucesso'}), 200

    except Exception as e:
        if conexao:
            conexao.rollback()
        import traceback
        traceback.print_exc()
        return jsonify({'erro': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conexao:
            conexao.close()