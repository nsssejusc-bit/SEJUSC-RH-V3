from flask import send_file, Blueprint, jsonify
from conection_mysql import connect_mysql
import os

bp_view_documentos = Blueprint('bp_view_documentos', __name__)

@bp_view_documentos.route('/api/documentos/view/<int:documento_id>', methods=['GET'])
def view_documento(documento_id):
    """
    Busca um documento pelo ID e o exibe no navegador.
    """
    try:
        with connect_mysql() as conexao:
            with conexao.cursor(dictionary=True) as cursor:
                query = "SELECT caminho_arquivo, nome_original FROM documentos WHERE id = %s"
                cursor.execute(query, (documento_id,))
                documento = cursor.fetchone()

        if not documento:
            return jsonify({'erro': 'Documento não encontrado no banco de dados'}), 404

        caminho_arquivo = documento['caminho_arquivo']
        nome_original = documento['nome_original']

        if not os.path.exists(caminho_arquivo):
            print(f"ERRO: Arquivo não encontrado no disco. ID: {documento_id}, Caminho: {caminho_arquivo}")
            return jsonify({'erro': 'Arquivo físico não encontrado no servidor'}), 404

        # `as_attachment=False` faz com que o arquivo seja exibido no navegador
        return send_file(
            caminho_arquivo,
            as_attachment=False,
            download_name=nome_original
        )

    except Exception as e:
        print(f"Erro ao visualizar documento: {e}")
        return jsonify({'erro': 'Erro interno ao processar a visualização'}), 500