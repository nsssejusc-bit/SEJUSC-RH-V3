from cerberus import Validator
from datetime import time, datetime

def validate_time(field, value, error):
    try:
        # Permite string vazia ou nula se não for obrigatório
        if value is None or value == "":
            return
        if len(value) == 7: 
            value = f"0{value}" 
        time.fromisoformat(value) 
    except ValueError:
        error(field, "Formato de horário inválido. Use H:MM:SS ou HH:MM:SS")

def validate_date(field, value, error):
    try:
        # Permite string vazia ou nula se não for obrigatório
        if value is None or value == "":
            return
        datetime.fromisoformat(value)
    except ValueError:
        error(field, "Formato de data inválido. Use YYYY-MM-DD")

schema_estagiario = {
    "secretaria_lotacao": { # Renomeado
        "type": "string", 
        "required": True,
        "minlength": 3
    },
    "nome": {
        "type": "string", 
        "required": True, 
        "minlength": 3
    },
    "cargo": {
        "type": "string", 
        "required": True, 
        "minlength": 3
    },
    "funcao": {
        "type": "string", 
        "required": False
    },
    "horario": {
        "type": "string", 
        "required": True
    },
    "entrada": {
        "type": "string", 
        "required": True,
        "check_with": validate_time
    },
    "saida": {
        "type": "string", 
        "required": True,
        "check_with": validate_time
    },
    # Campos Renomeados
    "recessoinicio": { 
        "type": "string", 
        "required": False,
        "nullable": True,
        "check_with": validate_date
    },
    "recessofinal": {
        "type": "string", 
        "required": False,
        "nullable": True,
        "check_with": validate_date
    },
    # Novos Campos
    "curso": {
        "type": "string",
        "required": True,
        "minlength": 2
    },
    "inicioContrato": {
        "type": "string",
        "required": True,
        "check_with": validate_date
    },
    "finalContrato": {
        "type": "string",
        "required": True,
        "check_with": validate_date
    }
}

validator_estagiario = Validator(schema_estagiario)