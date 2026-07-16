from flask import jsonify, request
from datetime import timedelta, date
from mysql.connector import Error
from conection_mysql import connect_mysql
from . import bp  
from flask_login import login_required 
from decorador import roles_required 


def timedelta_to_str(td):
    """Converte timedelta em string no formato HH:MM:SS"""
    total_seconds = int(td.total_seconds())
    hours, remainder = divmod(total_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    return f"{hours:02}:{minutes:02}:{seconds:02}"


# --- ROTA 1: BUSCAR TODOS (Lista da tela inicial) ---
@bp.route("/api/servidores", methods=["GET"])
# @login_required  
# @roles_required('admin', 'editor') 
def buscar_servidores():
    try:
        conexao = connect_mysql()
        cursor = conexao.cursor(dictionary=True)

        listar_setores = request.args.get("listar_setores", "false").lower() == "true"
        if listar_setores:
            consulta_setores = "SELECT DISTINCT secretaria_lotacao FROM funcionarios"
            cursor.execute(consulta_setores)
            setores = [row["secretaria_lotacao"] for row in cursor.fetchall()]
            return jsonify({"setores": setores}), 200

        consulta = "SELECT * FROM funcionarios WHERE status='ativo'"
        parametros = []

        setor = request.args.get("secretaria_lotacao")
        if setor:
            consulta += " AND secretaria_lotacao = %s"
            parametros.append(setor)

        nome = request.args.get("nome")
        if nome:
            consulta += " AND nome LIKE %s"
            parametros.append(f"%{nome}%")

        cursor.execute(consulta, tuple(parametros))
        servidores = cursor.fetchall()

        if len(servidores) == 0:
            conexao.close()
            return jsonify({"erro": "Nenhum servidor encontrado"}), 404

        for servidor in servidores:
            for key, value in servidor.items():
                if isinstance(value, timedelta):
                    servidor[key] = timedelta_to_str(value)

        return jsonify({"servidores": servidores}), 200

    except Error as e:
        return jsonify({"erro": f"Erro ao conectar ou buscar dados no banco de dados: {str(e)}"}), 500

    finally:
        if 'conexao' in locals() and conexao.is_connected():
            cursor.close()
            conexao.close()


# --- ROTA 2 (NOVA): BUSCAR UM ÚNICO SERVIDOR COM DETALHES ---
# Esta é a rota que fará os dados aparecerem na tela de atualização
@bp.route("/api/servidores/<int:id>", methods=["GET"])
# @login_required 
def buscar_servidor_por_id(id):
    conexao = None
    cursor = None
    try:
        conexao = connect_mysql()
        cursor = conexao.cursor(dictionary=True)

        # 1. Busca dados principais do funcionário
        query_func = "SELECT * FROM funcionarios WHERE id = %s"
        cursor.execute(query_func, (id,))
        servidor = cursor.fetchone()

        if not servidor:
            return jsonify({"erro": "Servidor não encontrado"}), 404

        # Tratamento de datas e horas no objeto principal
        for key, value in servidor.items():
            if isinstance(value, timedelta):
                servidor[key] = timedelta_to_str(value)
            if isinstance(value, date):
                servidor[key] = str(value)

        # 2. Busca Beneficiários
        query_ben = "SELECT * FROM beneficiarios WHERE funcionario_id = %s"
        cursor.execute(query_ben, (id,))
        beneficiarios = cursor.fetchall()
        
        for b in beneficiarios:
            if b.get('data_nascimento'):
                b['data_nascimento'] = str(b['data_nascimento'])

        # 3. Busca Transferências (TABELA NOVA)
        # Importante: Usando os nomes exatos do banco
        query_transf = """
            SELECT id, data_transferencia, de_lotacao, para_lotacao 
            FROM funcionario_transferencias 
            WHERE funcionario_id = %s
        """
        cursor.execute(query_transf, (id,))
        transferencias = cursor.fetchall()

        for t in transferencias:
            if t.get('data_transferencia'):
                t['data_transferencia'] = str(t['data_transferencia'])

        # 4. Busca Férias (TABELA NOVA)
        query_ferias = """
            SELECT id, periodo_aquisicao, periodo_utilizacao 
            FROM funcionario_ferias 
            WHERE funcionario_id = %s
        """
        cursor.execute(query_ferias, (id,))
        ferias = cursor.fetchall()

        # 5. Junta tudo no objeto final
        servidor['beneficiarios'] = beneficiarios
        servidor['transferencias'] = transferencias
        servidor['ferias'] = ferias

        return jsonify(servidor), 200

    except Error as e:
        return jsonify({"erro": f"Erro ao buscar detalhes do servidor: {str(e)}"}), 500

    finally:
        if 'conexao' in locals() and conexao.is_connected():
            cursor.close()
            conexao.close()