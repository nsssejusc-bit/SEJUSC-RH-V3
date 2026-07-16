from validators.criar_estagiario_validator import validator_estagiario as validator
from cerberus import Validator
from flask import jsonify, request, Blueprint
from conection_mysql import connect_mysql
from mysql.connector import Error
from flask_login import login_required, current_user
from decorador import roles_required
from datetime import datetime

bp_criar_estagiario = Blueprint('bp_criar_estagiario', __name__)

@bp_criar_estagiario.route('/api/estagiarios', methods=['POST'])
# @login_required
# @roles_required('admin','editor')
def criar_estagiario():
    try:
        conexao = connect_mysql()
        cursor = conexao.cursor(dictionary=True)
        body = request.json
        validate = validator.validate(body)
            
        if not validate:
            return jsonify({'erro': 'Dados inválidos', 'mensagem': validator.errors}), 400
    
        # Campos principais
        secretaria_lotacao = body.get('secretaria_lotacao')
        nome = body.get('nome')
        cargo = body.get('cargo')
        horario = body.get('horario')
        horarioentrada = body.get('entrada')
        horariosaida = body.get('saida')
        recessoinicio = body.get('recessoinicio')
        recessofinal = body.get('recessofinal')
        
        # Novas Colunas Estagiário
        curso = body.get('curso')
        inicioContrato = body.get('inicioContrato')
        finalContrato = body.get('finalContrato')
    
        # Verifica duplicidade
        verifica_se_estagiario_existe = "SELECT * FROM estagiarios WHERE nome = %s"
        cursor.execute(verifica_se_estagiario_existe, (nome,))
        estagiario = cursor.fetchone()
    
        if estagiario:
            conexao.close()
            return jsonify({'erro': 'Estagiário já cadastrado'}), 409

        # Insere no banco de dados
        criar_dados_estagiario = """
            INSERT INTO estagiarios (
                secretaria_lotacao, nome, cargo, horario, horario_entrada, horario_saida,
                recessoinicio, recessofinal, curso, inicioContrato, finalContrato
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(criar_dados_estagiario, (
            secretaria_lotacao, nome, cargo, horario, horarioentrada, horariosaida,
            recessoinicio, recessofinal, curso, inicioContrato, finalContrato
        ))
        conexao.commit()

        # ✅ Registra no histórico
        try:
            descricao_log = f"O usuário {getattr(current_user, 'nome', 'Desconhecido')} cadastrou o estagiário(a) {nome} do setor {secretaria_lotacao}"
            inserir_log = """
                INSERT INTO historico_logs (usuario, acao, tipo, data)
                VALUES (%s, %s, %s, %s)
            """
            cursor.execute(inserir_log, (
                getattr(current_user, 'nome', 'Desconhecido'),
                descricao_log,
                'cadastrado',
                datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            ))
            conexao.commit()
        except Exception as log_err:
            print("⚠️ Erro ao registrar log:", log_err)

        dados_retornados = {
            "id": cursor.lastrowid,
            "secretaria_lotacao": secretaria_lotacao,
            "nome": nome,
            "cargo": cargo,
            "horario": horario,
            "horarioentrada": horarioentrada,
            "horariosaida": horariosaida,
            "recessoinicio": recessoinicio,
            "recessofinal": recessofinal,
            "curso": curso,
            "inicioContrato": inicioContrato,
            "finalContrato": finalContrato
        }
        
        return jsonify(dados_retornados), 201

    except Error as e:
        return jsonify({'erro': 'Erro ao criar estagiário', 'mensagem': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conexao:
            conexao.close()
