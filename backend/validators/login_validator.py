from cerberus import Validator

schema = {
    'identificador': {'type': 'string', 'required': True},
    'senha': {'type': 'string', 'required': True},
    'termo': {'type': 'boolean', 'required': True},
}

validator = Validator(schema)
