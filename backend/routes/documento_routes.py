import os
import uuid
from flask import jsonify, request, Blueprint
from werkzeug.utils import secure_filename
from conection_mysql import connect_mysql 

bp_documentos = Blueprint('bp_documentos', __name__)

UPLOADS_FOLDER = os.path.join(os.getcwd(), 'uploads')

if not os.path.exists(UPLOADS_FOLDER):
    os.makedirs(UPLOADS_FOLDER)

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp_documentos.route('/api/documentos', methods=['POST'])
def upload_documento():
    if 'files' not in request.files:
        return jsonify({"error": "Requisição inválida: o campo 'files' é obrigatório."}), 400

    files = request.files.getlist('files')
    tipos_documento = request.form.getlist('tipos_documento')
    funcionario_id = request.form.get('funcionario_id')
    estagiario_id = request.form.get('estagiario_id')

    if not funcionario_id and not estagiario_id:
        return jsonify({"error": "É necessário fornecer 'funcionario_id' ou 'estagiario_id'."}), 400

    conn = None
    cursor = None
    uploaded_documents_info = []
    errors = []

    try:
        conn = connect_mysql()
        cursor = conn.cursor(dictionary=True)

        for index, file in enumerate(files):
            if file.filename == '' or not allowed_file(file.filename):
                continue

            tipo_documento_atual = tipos_documento[index]
            original_filename = secure_filename(file.filename)
            extension = original_filename.rsplit('.', 1)[1].lower()
            unique_filename = f"{uuid.uuid4()}.{extension}"
            filepath = os.path.join(UPLOADS_FOLDER, unique_filename)
            
            # --- LÓGICA DE ATUALIZAÇÃO/INSERÇÃO ---
            
            # 1. Verifica se já existe um documento do mesmo tipo para o funcionário/estagiário
            query_check = "SELECT id, caminho_arquivo FROM documentos WHERE tipo_documento = %s AND "
            params_check = [tipo_documento_atual]
            if funcionario_id:
                query_check += "funcionario_id = %s"
                params_check.append(funcionario_id)
            else:
                query_check += "estagiario_id = %s"
                params_check.append(estagiario_id)
            
            cursor.execute(query_check, params_check)
            documento_existente = cursor.fetchone()

            # Salva o novo arquivo
            file.save(filepath)

            if documento_existente:
                # 2. Se existe, ATUALIZA (UPDATE) o registro
                documento_id = documento_existente['id']
                caminho_antigo = documento_existente['caminho_arquivo']
                
                query_update = """
                    UPDATE documentos 
                    SET nome_original = %s, nome_armazenado = %s, caminho_arquivo = %s, data_upload = NOW()
                    WHERE id = %s
                """
                cursor.execute(query_update, (original_filename, unique_filename, filepath, documento_id))
                
                # Remove o arquivo físico antigo para economizar espaço
                if caminho_antigo and os.path.exists(caminho_antigo):
                    try:
                        os.remove(caminho_antigo)
                    except OSError as e:
                        print(f"Erro ao remover arquivo antigo {caminho_antigo}: {e}")

                status_message = "Documento atualizado com sucesso"
            else:
                # 3. Se não existe, INSERE (INSERT) um novo registro
                query_insert = """
                    INSERT INTO documentos
                    (nome_original, nome_armazenado, caminho_arquivo, tipo_documento, funcionario_id, estagiario_id)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """
                id_func = int(funcionario_id) if funcionario_id else None
                id_estag = int(estagiario_id) if estagiario_id else None
                cursor.execute(query_insert, (original_filename, unique_filename, filepath, tipo_documento_atual, id_func, id_estag))
                documento_id = cursor.lastrowid
                status_message = "Documento inserido com sucesso"

            conn.commit()
            uploaded_documents_info.append({
                "document_id": documento_id,
                "original_filename": original_filename,
                "status": status_message
            })

    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Erro no upload: {e}")
        errors.append(f"Erro ao processar o arquivo: {e}")
        return jsonify({"error": "Erro interno ao processar os uploads.", "details": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

    if uploaded_documents_info:
        return jsonify({
            "message": "Operação concluída.",
            "uploaded_documents": uploaded_documents_info,
            "warnings": errors
        }), 201
    else:
        return jsonify({"error": "Nenhum documento foi enviado ou todos falharam.", "details": errors}), 400
