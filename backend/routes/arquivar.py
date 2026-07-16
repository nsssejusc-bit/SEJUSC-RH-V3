from flask import jsonify, request, Blueprint
from conection_mysql import connect_mysql
from mysql.connector import Error

bp_arquivar_servidor = Blueprint('bp_arquivar_servidor', __name__)

@bp_arquivar_servidor.route('/api/servidores/<int:id>/arquivar', methods=['PATCH'])
def arquivar_servidor(id):
    try:
        conexao = connect_mysql()
        cursor = conexao.cursor(dictionary=True)

        # Verifica se o servidor existe
        cursor.execute("SELECT * FROM funcionarios WHERE id = %s", (id,))
        servidor = cursor.fetchone()

        if servidor is None:
            conexao.close()
            return jsonify({'erro': 'Servidor não encontrado'}), 404

        # Atualiza status para arquivado
        cursor.execute("""
            UPDATE funcionarios
            SET status = 'arquivado'
            WHERE id = %s
        """, (id,))
        
        conexao.commit()

        resposta = {
            'id': servidor.get('id'),
            'nome': servidor.get('nome'),
            'setor': servidor.get('secretaria_lotacao')
        }

        conexao.close()
        return jsonify({
            'mensagem': 'Servidor arquivado com sucesso',
            'servidor_arquivado': resposta
        }), 200

    except Exception as exception:
        return jsonify({'erro': f'Erro no servidor: {str(exception)}'}), 500
