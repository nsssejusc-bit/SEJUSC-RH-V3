export interface ISetorServidor {
  id: number;
  quantidade: number;
  setor: string;
}

export interface IServidor {
  id: number;
  cargo: string;
  nome: string;
  secretaria_lotacao: string;
}

export interface IEstagiario {
  id: number;
  nome: string;
  secretaria_lotacao: string;
}

export interface ISetorEstagiario {
  id: number;
  lotacao: string;
  quantidade: number;
}
