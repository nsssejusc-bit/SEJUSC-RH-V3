from cerberus import Validator
from datetime import time, datetime

def validate_time(field, value, error):
    try:
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

schema = {
    'secretaria_lotacao': {'type': 'string', 'required': True}, # Renomeado
    'nome': {'type': 'string', 'required': True},
    'matricula': {'type': 'string', 'required': False, 'nullable': True}, # Alterado para opcional
    'cargo': {'type': 'string', 'required': True},
    'horario': {'type': 'string', 'required': True},
    'entrada': {'type': 'string', 'required': True}, # Manter 'entrada' e 'saida' como vêm do Zod
    'saida': {'type': 'string', 'required': True},
    'data_nascimento': {'type': 'string', 'required': True, 'check_with': validate_date},
    'sexo': {'type': 'string', 'required': True},
    'estado_civil': {'type': 'string', 'required': True},
    'naturalidade': {'type': 'string', 'required': True},
    'nacionalidade': {'type': 'string', 'required': True},
    'identidade': {'type': 'string', 'required': True},
    'titulo_eleitor': {'type': 'string', 'required': True},
    'cpf': {'type': 'string', 'required': True},
    'pis': {'type': 'string', 'required': False, 'nullable': True}, # Alterado para opcional
    'data_admissao': {'type': 'string', 'required': True, 'check_with': validate_date},
    
    'endereco': {'type': 'string', 'required': False, 'nullable': True},
    'nome_pai': {'type': 'string', 'required': False, 'nullable': True},
    'nome_mae': {'type': 'string', 'required': False, 'nullable': True},
    'servico_militar': {'type': 'string', 'required': False, 'nullable': True},
    'carteira_profissional': {'type': 'string', 'required': False, 'nullable': True},
    'data_posse': {'type': 'string', 'required': False, 'nullable': True, 'check_with': validate_date},

    # Novos Campos
    'vinculo': {'type': 'string', 'required': True, 'allowed': ['efetivo', 'comissionado']},
    'curso': {'type': 'string', 'required': False, 'nullable': True},
    'pdc': {'type': 'boolean', 'required': False, 'nullable': True} # Assumindo booleano
}


validator = Validator(schema)