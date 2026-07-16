export interface IFilterOptions {
  checkbox: string;
  search: string;
  month: string;
  year: string;
}

export interface User {
  cargo: string;
  nome: string;
  role: string;
}

type Entrada = "" | "08:00";
type Saida = "" | "14:00" | "17:00";
type Sexo = "" | "MASCULINO" | "FEMININO" | "OUTRO";
type EstadoCivil = "" | "SOLTEIRO" | "CASADO" | "DIVORCIADO" | "VIUVO";
type Vinculo = "" | "efetivo" | "comissionado";


export type ITransferencia = {
  id?: number;
  data_transferencia: string;
  de_lotacao: string;         
  para_lotacao: string;      
};

export type IFerias = {
  id?: number;
  periodo_aquisicao: string;
  periodo_utilizacao: string;
};

export interface IServidor {
  id?: number;
  nome: string;
  secretaria_lotacao: string; 
  matricula: string;
  cargo: string;
  horario: string;
  horarioentrada: Entrada;
  horariosaida: Saida;
  data_nascimento: string;
  sexo: Sexo;
  estado_civil: EstadoCivil;
  naturalidade: string;
  nacionalidade: string;
  identidade: string;
  titulo_eleitor: string;
  cpf: string;
  pis: string;
  data_Admissao: string;
  endereco: string;
  nome_pai: string;
  nome_mae: string;
  servico_militar: string;
  carteira_profissional: string;
  data_posse: string;
  vencimento_ou_salario: string;
  descanso_semanal: string;
  inicio_atividades: string;
  data_desligamento: string;
  
  // Novos campos Servidor
  vinculo: Vinculo;
  curso: string;
  pdc: boolean;
  
  feriasinicio?: string; 
  feriasfinal?: string;
  
  // Novos campos de lista e texto
  outras_anotacoes?: string;
  transferencias?: ITransferencia[];
  ferias?: IFerias[];
}

export interface ICreateServidor {
  id?: number;
  nome: string;
  secretaria_lotacao: string;
  matricula: string;
  cargo: string;
  horario: string;
  horarioentrada: Entrada;
  horariosaida: Saida;
  data_nascimento: string;
  sexo: Sexo;
  estado_civil: EstadoCivil;
  naturalidade: string;
  nacionalidade: string;
  identidade: string;
  titulo_eleitor: string;
  cpf: string;
  pis: string;
  endereco: string;
  nome_pai: string;
  nome_mae: string;
  servico_militar: string;
  carteira_profissional: string;
  data_posse: string;
  data_Admissao: string;

  vinculo: Vinculo;
  curso: string;
  pdc: boolean;

  feriasinicio?: string; 
  feriasfinal?: string;
}

type Beneficiario = {
  nome: "";
  parentesco: "";
  data_nascimento: "";
};

export interface IUpdateServidor extends IServidor {
  beneficiarios?: Beneficiario[];
  // transferencias e ferias já vêm de IServidor
}

export interface IEstagiario {
  id?: number;
  nome: string;
  secretaria_lotacao: string;
  cargo: string;
  horario: string;
  horario_entrada: "" | "08:00" | "11:00";
  horario_saida: Saida;
  recessoinicio: string;
  recessofinal: string;

  curso: string;
  inicioContrato: string;
  finalContrato: string;
}

export interface ICreateEstagiario {
  id?: number;
  nome: string;
  secretaria_lotacao: string;
  cargo: string;
  horario: string;
  horario_entrada: "" | "08:00" | "11:00";
  horario_saida: Saida;

  curso: string;
  inicioContrato: string;
  finalContrato: string;
}