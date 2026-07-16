from validators.criar_estagiario_validator import validator_estagiario as validator
from cerberus import Validator
from flask import jsonify, request, Blueprint
from conection_mysql import connect_mysql
from mysql.connector import Error
from flask_login import login_required, current_user
from decorador import roles_required

bp_atualizar_estagiario = Blueprint('bp_atualizar_estagiario', __name__)

@bp_atualizar_estagiario.route('/api/estagiarios/<int:id>', methods=['PUT'])
#@login_required
#@roles_required('admin','editor')
def atualizar_estagiario(id):
    conexao = None
    cursor = None
    try:
        conexao = connect_mysql()
        cursor = conexao.cursor(dictionary=True)
        body = request.json

        # Verifica se o estagiário existe
        cursor.execute("SELECT nome FROM estagiarios WHERE id = %s", (id,))
        estagiario_existente = cursor.fetchone()

        if not estagiario_existente:
            return jsonify({'erro': 'Estagiário não encontrado'}), 404

        nome_estagiario = estagiario_existente['nome']

        # Campos Renomeados e Novos
        secretaria_lotacao = body.get('secretaria_lotacao')
        nome = body.get('nome')
        cargo = body.get('cargo')
        horario = body.get('horario')
        horarioentrada = body.get('entrada')
        horariosaida = body.get('saida')
        recessoinicio = body.get('recessoinicio')
        recessofinal = body.get('recessofinal')
        curso = body.get('curso')
        inicioContrato = body.get('inicioContrato')
        finalContrato = body.get('finalContrato')

        # Dicionário de campos permitidos
        campos_para_atualizar = {
            'secretaria_lotacao': secretaria_lotacao,
            'nome': nome,
            'cargo': cargo,
            'horario': horario,
            'horario_entrada': horarioentrada,
            'horario_saida': horariosaida,
            'recessoinicio': recessoinicio,
            'recessofinal': recessofinal,
            'curso': curso,
            'inicioContrato': inicioContrato,
            'finalContrato': finalContrato
        }

        # Filtra apenas os campos enviados
        campos_enviados = {k: v for k, v in campos_para_atualizar.items() if v is not None}

        if not campos_enviados:
            return jsonify({'info': 'Nenhum dado enviado para atualização'}), 200

        # Monta a query dinâmica
        set_clause = ', '.join([f"{campo} = %s" for campo in campos_enviados.keys()])
        valores = list(campos_enviados.values())
        valores.append(id)

        query_update = f"""
            UPDATE estagiarios 
            SET {set_clause}
            WHERE id = %s
        """

        cursor.execute(query_update, valores)

        # 🟩 Registro de histórico (versão compatível)
        usuario_responsavel = getattr(current_user, 'username', 'Sistema')
        mensagem = f"O usuário de nome {usuario_responsavel} atualizou o estagiário {nome_estagiario} do setor {secretaria_lotacao or 'SETOR NÃO INFORMADO'}"
        acao = 'Atualizar'

        cursor.execute("""
            INSERT INTO historico_logs (mensagem, nome, acao, data_criacao)
            VALUES (%s, %s, %s, NOW())
        """, (mensagem, nome_estagiario, acao))


        conexao.commit()

        # Retorna os dados atualizados
        dados_retornados = {
            "mensagem": "Estagiário atualizado com sucesso",
            "id": id,
            **campos_enviados
        }

        return jsonify(dados_retornados), 200

    except Error as e:
        if conexao:
            conexao.rollback()
        return jsonify({'erro': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conexao:
            conexao.close()
