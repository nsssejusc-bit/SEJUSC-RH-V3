# routes/feriados_municipais.py
from flask import Blueprint, request, jsonify
from datetime import datetime, date
import calendar
from mysql.connector import Error
from conection_mysql import connect_mysql

feriados_bp = Blueprint("feriados_municipais", __name__, url_prefix="/api")

@feriados_bp.post("/feriados-municipais")
def criar_feriado_municipal():
    """
    Cadastra feriado/ponto facultativo.
    Espera JSON:
      - data: "dd/mm/aaaa" ou "yyyy-mm-dd"
      - descricao: str
      - estado: "AM" (UF)
      - ponto_facultativo: 0 ou 1
    Retorna 201 + registro criado, 409 se já existir.
    """
    try:
        payload = request.get_json(force=True) or {}
        data_raw = (payload.get("data") or "").strip()
        descricao = (payload.get("descricao") or "").strip()
        estado = (payload.get("estado") or "").strip().upper() or "AM"
        pf = int(payload.get("ponto_facultativo") or 0)

        if not data_raw or not descricao:
            return jsonify({"erro": "Campos obrigatórios: data, descricao"}), 400

        # aceita dd/mm/aaaa ou yyyy-mm-dd
        try:
            if "/" in data_raw:
                data_sql = datetime.strptime(data_raw, "%d/%m/%Y").date()
            else:
                data_sql = datetime.strptime(data_raw, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"erro": "Formato de data inválido"}), 400

        conn = connect_mysql()
        if not conn:
            return jsonify({"erro": "Falha na conexão com o banco"}), 500

        # Verifica duplicidade (mesma data + estado)
        sel = """
          SELECT id FROM sistema_frequenciarh.feriados_municipais
          WHERE estado=%s AND data=%s
          LIMIT 1
        """
        ins = """
          INSERT INTO sistema_frequenciarh.feriados_municipais
          (estado, data, descricao, ponto_facultativo)
          VALUES (%s, %s, %s, %s)
        """
        with conn.cursor(dictionary=True) as cur:
            cur.execute(sel, (estado, data_sql))
            ja_existe = cur.fetchone()
            if ja_existe:
                return jsonify({"erro": "Data já cadastrada para este estado"}), 409

            cur.execute(ins, (estado, data_sql, descricao, pf))
            conn.commit()
            novo_id = cur.lastrowid

        return jsonify({
            "id": novo_id,
            "estado": estado,
            "data": data_sql.strftime("%Y-%m-%d"),
            "descricao": descricao,
            "ponto_facultativo": pf
        }), 201

    except Error as e:
        return jsonify({"erro": f"Erro MySQL: {e}"}), 500
    except Exception as e:
        return jsonify({"erro": str(e)}), 500


@feriados_bp.get("/feriados-municipais")
def listar_feriados_mensais():
    """
    Lista feriados/pontos facultativos por mês/ano/estado.
    Query params:
      - ano: int (padrão = ano atual)
      - mes: int 1-12 (padrão = mês atual)
      - estado: str (padrão = 'AM')
    """
    try:
        hoje = date.today()
        ano = int(request.args.get("ano", hoje.year))
        mes = int(request.args.get("mes", hoje.month))
        estado = request.args.get("estado", "AM").upper()

        primeiro_dia = date(ano, mes, 1)
        ultimo_dia = date(ano, mes, calendar.monthrange(ano, mes)[1])

        conn = connect_mysql()
        if not conn:
            return jsonify({"erro": "Falha de conexão com o banco"}), 500

        sql = """
            SELECT
                id,
                estado,
                data,
                COALESCE(
                  NULLIF(TRIM(descricao), ''),
                  CASE WHEN ponto_facultativo = 1 THEN 'Ponto Facultativo' ELSE 'Feriado' END
                ) AS descricao,
                ponto_facultativo
            FROM sistema_frequenciarh.feriados_municipais
            WHERE estado = %s AND data BETWEEN %s AND %s
            ORDER BY data
        """
        with conn.cursor(dictionary=True) as cur:
            cur.execute(sql, (estado, primeiro_dia, ultimo_dia))
            rows = cur.fetchall()

        itens = [
            {
                "id": r["id"],
                "estado": r["estado"],
                "data": r["data"].strftime("%Y-%m-%d"),
                "descricao": r["descricao"],
                "ponto_facultativo": int(r["ponto_facultativo"]),
                "tipo": "PONTO_FACULTATIVO" if int(r["ponto_facultativo"]) == 1 else "FERIADO",
            }
            for r in rows
        ]

        return jsonify({"ano": ano, "mes": mes, "estado": estado, "itens": itens}), 200

    except Error as e:
        return jsonify({"erro": f"Erro MySQL: {e}"}), 500
    except Exception as e:
        return jsonify({"erro": str(e)}), 500
