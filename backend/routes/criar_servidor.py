from validators.criar_servidor_validator import validator
from cerberus import Validator
from flask import jsonify, request, Blueprint
from conection_mysql import connect_mysql
from mysql.connector import Error
from flask_login import login_required, current_user
from decorador import roles_required
from datetime import datetime

bp_criar_servidor = Blueprint('bp_criar_servidor', __name__)

@bp_criar_servidor.route('/api/criar/servidores', methods=['POST'])
# @login_required
# @roles_required('admin','editor')
def criar_servidor():
    conexao = None
    cursor = None
    try:
        body = request.get_json()
        if not body:
            return jsonify({'erro': 'JSON não enviado ou malformado'}), 400

        validate = validator.validate(body)
        if not validate:
            print("Erros de validação:", validator.errors)
            return jsonify({'erro': 'Dados inválidos', 'mensagem': validator.errors}), 400

        try:
            conexao = connect_mysql()
            cursor = conexao.cursor(dictionary=True)
        except Error as db_err:
            return jsonify({'erro': 'Erro ao conectar ao banco de dados', 'mensagem': str(db_err)}), 500

        # Campos Renomeados e Novos
        secretaria_lotacao = body.get('secretaria_lotacao')
        nome = body.get('nome')
        matricula = body.get('matricula')
        cargo = body.get('cargo')
        horario = body.get('horario')
        horarioentrada = body.get('entrada')
        horariosaida = body.get('saida')
        dataNascimento = body.get('data_nascimento')
        sexo = body.get('sexo')
        estadoCivil = body.get('estado_civil')
        naturalidade = body.get('naturalidade')
        nacionalidade = body.get('nacionalidade')
        identidade = body.get('identidade')
        tituloEleitor = body.get('titulo_eleitor')
        cpf = body.get('cpf')
        pis = body.get('pis')
        dataAdmissao = body.get('data_admissao')
        endereco = body.get('endereco')
        nome_pai = body.get('nome_pai')
        nome_mae = body.get('nome_mae')
        servico_militar = body.get('servico_militar')
        carteira_profissional = body.get('carteira_profissional')
        data_posse = body.get('data_posse')
        vinculo = body.get('vinculo')
        curso = body.get('curso')
        pdc = body.get('pdc')

        # Verifica duplicidade
        verifica_se_servidor_existe = "SELECT * FROM funcionarios WHERE nome = %s"
        cursor.execute(verifica_se_servidor_existe, (nome,))
        if cursor.fetchone():
            return jsonify({'erro': 'Servidor já cadastrado'}), 409

        # Cria registro no banco
        criar_dados_servidor = """
            INSERT INTO funcionarios (
                secretaria_lotacao, nome, matricula, cargo, horario, horarioentrada, horariosaida, 
                data_Nascimento, sexo, estado_Civil, naturalidade, nacionalidade, 
                identidade, titulo_Eleitor, cpf, pis, data_Admissao,
                endereco, nome_pai, nome_mae, servico_militar, carteira_profissional, data_posse,
                vinculo, curso, pdc, cadastrado_por
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(criar_dados_servidor, (
            secretaria_lotacao, nome, matricula, cargo, horario, horarioentrada, horariosaida,
            dataNascimento, sexo, estadoCivil, naturalidade,
            nacionalidade, identidade, tituloEleitor, cpf, pis, dataAdmissao,
            endereco, nome_pai, nome_mae, servico_militar, carteira_profissional, data_posse,
            vinculo, curso, pdc, current_user.id if hasattr(current_user, 'id') else None
        ))
        conexao.commit()

        # ✅ Adiciona registro no histórico
        try:
            descricao_log = f"O usuário {getattr(current_user, 'nome', 'Desconhecido')} cadastrou o servidor(a) {nome} do setor {secretaria_lotacao}"
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
            "secretaria_lotacao": secretaria_lotacao, "nome": nome, "matricula": matricula, "cargo": cargo,
            "data_admissao": dataAdmissao, "horario": horario, "entrada": horarioentrada,
            "saida": horariosaida, "data_nascimento": dataNascimento, "sexo": sexo,
            'estado_civil': estadoCivil, "naturalidade": naturalidade, "nacionalidade": nacionalidade,
            "identidade": identidade, "titulo_eleitor": tituloEleitor, "cpf": cpf, "pis": pis,
            "endereco": endereco, "nome_pai": nome_pai, "nome_mae": nome_mae, 
            "servico_militar": servico_militar, "carteira_profissional": carteira_profissional, 
            "data_posse": data_posse,
            "vinculo": vinculo, "curso": curso, "pdc": pdc
        }

        return jsonify({'servidor': dados_retornados}), 201

    except Exception as exception:
        return jsonify({'erro': 'Erro inesperado', 'mensagem': str(exception)}), 500

    finally:
        if cursor:
            cursor.close()
        if conexao:
            conexao.close()
