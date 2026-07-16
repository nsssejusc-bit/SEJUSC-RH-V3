import re  # <-- ADICIONADO
from datetime import datetime
from validators.login_validator import validator
from flask import Blueprint, request, jsonify
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required
import mysql.connector

auth_bp = Blueprint("auth", __name__)


login_manager = LoginManager()

def get_db_connection():
    return mysql.connector.connect(
        host="12.90.1.2",
        user="devop",
        password="DEVsjc@2025",
        database="sistema_frequenciarh"
    )

class Usuario(UserMixin):
    def __init__(self, id, matricula, nome, role,cargo):
        self.id = id
        self.matricula = matricula
        self.nome = nome
        self.role = role
        self.cargo = cargo

    def get_id(self):
        return str(self.id)

@login_manager.user_loader
def load_user(user_id):
    conexao = get_db_connection()
    cursor = conexao.cursor(dictionary=True)

    cursor.execute("SELECT id, matricula, nome, role, cargo FROM usuarios WHERE id = %s", (user_id,))
    usuario_data = cursor.fetchone()

    cursor.close()
    conexao.close()

    if usuario_data:
        return Usuario(usuario_data["id"], usuario_data["matricula"], usuario_data["nome"], usuario_data["role"], usuario_data["cargo"])
    return None

@auth_bp.route("/api/login", methods=["POST"])
def login():
    try:
        body = request.get_json()
        validate = validator.validate(body)
        
        if not validate:
            print("Erros de validação:", validator.errors)
            return jsonify({'erro': 'Dados inválidos', 'mensagem': validator.errors}), 400

        # --- Alteração 1: Mudança de 'matricula' para 'identificador' ---
        identificador = body.get("identificador") 
        senha = body.get("senha")
        termo = body.get("termo")

        # +++ ALTERAÇÃO 2: Limpar o identificador (remover '.', '-', '/') +++
        identificador_limpo = re.sub(r'[.\-/]', '', identificador)

        conexao = get_db_connection()
        cursor = conexao.cursor(dictionary=True)

        # --- Alteração 3: Atualização do query SQL ---
        query = """
            SELECT id, matricula, nome, senha, role, cargo, primeiro_acesso, cpf 
            FROM usuarios 
            WHERE matricula = %s OR cpf = %s
        """
        # +++ ALTERAÇÃO 4: Usar identificador original E o limpo +++
        # A matrícula (que pode ter letras/pontos) usa o 'identificador' original.
        # O CPF (só números) usa o 'identificador_limpo'.
        cursor.execute(query, (identificador, identificador_limpo))
        usuario_data = cursor.fetchone()

        if not usuario_data:
            cursor.close()
            conexao.close()
            return jsonify({"erro": "Usuário não encontrado!"}), 404
        
        if usuario_data["senha"] != senha:
            cursor.close()
            conexao.close()
            return jsonify({"erro": "Senha inválida!"}), 401

        if usuario_data["primeiro_acesso"]:
            if termo:
                try:
                    data_termo = datetime.now()
                    
                    # --- Alteração 5: Garantir que o UPDATE use a 'matricula' ---
                    matricula_usuario = usuario_data["matricula"] 
                    
                    cursor.execute(
                        "UPDATE usuarios SET primeiro_acesso = %s, termo = %s, data_termo_aceito = %s WHERE matricula = %s",
                        (False, True, data_termo, matricula_usuario)
                    )
                    conexao.commit()
                except Exception as e:
                    print(f"Erro ao atualizar o primeiro acesso: {e}")
                    conexao.rollback()
            else:
                cursor.close()
                conexao.close()
                return jsonify({"erro": "Para realizar o primeiro login, você precisa aceitar o termo de uso!"}), 401

        usuario = Usuario(usuario_data["id"], usuario_data["matricula"], usuario_data["nome"], usuario_data["role"], usuario_data["cargo"])
        login_user(usuario, remember=True)

        return jsonify({"mensagem": "Login realizado com sucesso!", "nome": usuario.nome, "role": usuario.role, "cargo": usuario.cargo}), 200

    except Exception as exception:
        return jsonify({'erro': 'Erro inesperado', 'mensagem': str(exception)}), 500

@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"mensagem": "Logout realizado com sucesso!"}), 200