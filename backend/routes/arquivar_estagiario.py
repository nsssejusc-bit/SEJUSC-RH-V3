from flask import jsonify, request, Blueprint
from conection_mysql import connect_mysql
from mysql.connector import Error

bp_arquivar_estagiario = Blueprint('bp_arquivar_estagiario', __name__)

@bp_arquivar_estagiario.route('/api/estagiarios/<int:id>/arquivar', methods=['PATCH'])
def arquivar_estagiario(id):
    try:
        conexao = connect_mysql()
        cursor = conexao.cursor(dictionary=True)

        # Verifica se o estagiário existe
        cursor.execute("SELECT * FROM estagiarios WHERE id = %s", (id,))
        estagiario = cursor.fetchone()

        if estagiario is None:
            conexao.close()
            return jsonify({'erro': 'Estagiário não encontrado'}), 404

        # Atualiza status
        cursor.execute("""
            UPDATE estagiarios
            SET status = 'arquivado'
            WHERE id = %s
        """, (id,))
        
        conexao.commit()

        resposta = {
            'id': estagiario.get('id'),
            'nome': estagiario.get('nome'),
            'setor': estagiario.get('secretaria_lotacao')
        }

        conexao.close()
        return jsonify({
            'mensagem': 'Estagiário arquivado com sucesso',
            'estagiario_arquivado': resposta
        }), 200

    except Exception as exception:
        return jsonify({'erro': f'Erro no servidor: {str(exception)}'}), 500
