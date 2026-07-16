import React from "react";

import type { IEstagiario, IServidor } from "@/interfaces";
import { Button, Input, Select } from "@/shared";

import useFormUpdateServidor from "../hooks/useFormUpdateServidor";

type Entrada = "" | "08:00";
type Saida = "" | "14:00" | "17:00";
type Sexo = "" | "MASCULINO" | "FEMININO" | "OUTRO";
type EstadoCivil = "" | "SOLTEIRO" | "CASADO" | "DIVORCIADO" | "VIUVO";
type Vinculo = "" | "efetivo" | "comissionado";

type FormCreateServidorProps = {
  isModalOpen: {
    servidor: IServidor | null;
    estagiario: IEstagiario | null;
    modal: boolean;
  };
  setIsModalOpen: React.Dispatch<
    React.SetStateAction<{
      servidor: IServidor | null;
      estagiario: IEstagiario | null;
      modal: boolean;
      action: string | null;
    }>
  >;
};

export default function FormUpdateServidor({
  isModalOpen,
  setIsModalOpen,
}: FormCreateServidorProps) {
  const { servidor } = isModalOpen;

  const {
    handleSubmit,
    handleChange,
    handleAddBeneficiario,
    setFormValues,
    formValues,
    // Novas funções
    handleAddTransferencia,
    handleTransferenciaChange,
    handleRemoveTransferencia,
    handleAddFerias,
    handleFeriasChange,
    handleRemoveFerias,
  } = useFormUpdateServidor(servidor);

  return (
    <div>
      <h1 className="pb-8 text-4xl font-semibold text-sky-950">
        Atualizar Servidor
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <div className="flex flex-col gap-6">
          <Input
            id="nome"
            label="Nome Completo*"
            placeholder="Yuri Odilon Nogueira Moura"
            value={formValues?.nome}
            onChange={({ currentTarget }) =>
              setFormValues((prevValues) => ({
                ...prevValues,
                nome: currentTarget.value.toUpperCase(),
              }))
            }
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <div className="grow">
                <Input
                  id="matricula"
                  label="Matrícula"
                  placeholder="123.456-7 A"
                  value={formValues?.matricula}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      matricula: currentTarget.value,
                    }))
                  }
                />
              </div>
              <div className="grow">
                <Input
                  id="cpf"
                  label="CPF*"
                  placeholder="123.456.789-01"
                  required
                  value={formValues?.cpf}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      cpf: currentTarget.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="grow">
                <Input
                  id="identidade"
                  label="Identidade*"
                  placeholder="1234567-8"
                  required
                  value={formValues?.identidade}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      identidade: currentTarget.value.toUpperCase(),
                    }))
                  }
                />
              </div>
              <div className="grow">
                <Input
                  id="naturalidade"
                  label="Naturalidade*"
                  placeholder="Manaus/AM"
                  required
                  value={formValues?.naturalidade}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      naturalidade: currentTarget.value.toUpperCase(),
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <div className="grow">
                <Input
                  id="nacionalidade"
                  label="Nacionalidade*"
                  placeholder="Brasileira"
                  required
                  value={formValues?.nacionalidade}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      nacionalidade: currentTarget.value,
                    }))
                  }
                />
              </div>
              <div className="grow">
                <Input
                  id="carteira_profissional"
                  label="Carteira Profissional*"
                  placeholder="123456/AM"
                  required
                  value={formValues?.carteira_profissional}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      carteira_profissional: currentTarget.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="grow">
                <Select
                  id="sexo"
                  label="Sexo*"
                  optionLabel="selecione uma opção"
                  options={[
                    { label: "MASCULINO", value: "MASCULINO" },
                    { label: "FEMININO", value: "FEMININO" },
                    { label: "OUTRO", value: "OUTRO" },
                  ]}
                  required
                  value={formValues?.sexo}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      sexo: currentTarget.value as Sexo,
                    }))
                  }
                />
              </div>
              <div className="grow">
                <Select
                  id="estado_civil"
                  label="Estado Civil*"
                  optionLabel="selecione uma opção"
                  options={[
                    { label: "SOLTEIRO(A)", value: "SOLTEIRO" },
                    { label: "CASADO(A)", value: "CASADO" },
                    { label: "DIVORCIADO(A)", value: "DIVORCIADO" },
                    { label: "VIUVO(A)", value: "VIUVO" },
                  ]}
                  required
                  value={formValues?.estado_civil}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      estado_civil: currentTarget.value as EstadoCivil,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex gap-4">
              <div className="grow">
                <Input
                  id="titulo_eleitor"
                  label="Título de Eleitor*"
                  placeholder="123456789012"
                  required
                  value={formValues?.titulo_eleitor}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      titulo_eleitor: currentTarget.value,
                    }))
                  }
                />
              </div>
              <div className="grow">
                <Input
                  id="secretaria_lotacao"
                  label="Secretaria/Lotação*"
                  placeholder="SECEX/ASCOM"
                  required
                  value={formValues?.secretaria_lotacao}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      secretaria_lotacao: currentTarget.value.toUpperCase(),
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="grow">
                <Select
                  id="horarioentrada"
                  label="Entrada*"
                  optionLabel="selecione uma opção"
                  options={[{ label: "08:00", value: "08:00" }]}
                  required
                  value={formValues.horarioentrada.slice(0, 5)}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      horarioentrada: currentTarget.value as Entrada,
                    }))
                  }
                />
              </div>
              <div className="grow">
                <Select
                  id="horariosaida"
                  label="Saida*"
                  optionLabel="selecione uma opção"
                  options={[
                    { label: "14:00", value: "14:00" },
                    { label: "17:00", value: "17:00" },
                  ]}
                  required
                  value={formValues.horariosaida.slice(0, 5)}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      horariosaida: currentTarget.value as Saida,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex gap-4">
              <div className="grow">
                <Input
                  id="data_nascimento"
                  label="Data do Nascimento*"
                  type="date"
                  required
                  value={formValues.data_nascimento}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      data_nascimento: currentTarget.value,
                    }))
                  }
                />
              </div>
              <div className="grow">
                <Input
                  id="data_Admissao"
                  label="Data de Admissao*"
                  type="date"
                  required
                  value={formValues.data_Admissao}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      data_Admissao: currentTarget.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="grow">
                <Input
                  id="endereco"
                  label="Endereço*"
                  placeholder="Avenida dos Testes, 456, Bairro da Interface, São Paulo-SP"
                  required
                  value={formValues?.endereco}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      endereco: currentTarget.value,
                    }))
                  }
                />
              </div>
              <div className="grow">
                <Input
                  id="nome_pai"
                  label="Nome do Pai"
                  placeholder="José Alves Neto"
                  value={formValues?.nome_pai}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      nome_pai: currentTarget.value.toUpperCase(),
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex gap-4">
              <div className="grow">
                <Input
                  id="nome_mae"
                  label="Nome da Mãe*"
                  placeholder="Francisca Marlene"
                  required
                  value={formValues?.nome_mae}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      nome_mae: currentTarget.value.toUpperCase(),
                    }))
                  }
                />
              </div>
              <div className="grow">
                <Input
                  id="servico_militar"
                  label="Serviço Militar"
                  value={formValues?.servico_militar}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      servico_militar: currentTarget.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="grow">
                <Input
                  id="cargo"
                  label="Cargo*"
                  placeholder="Assessor I"
                  required
                  value={formValues?.cargo}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      cargo: currentTarget.value.toUpperCase(),
                    }))
                  }
                />
              </div>
              <div className="grow">
                <Input
                  id="data_posse"
                  label="Data da Posse"
                  type="date"
                  required
                  value={formValues.data_posse}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      data_posse: currentTarget.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex gap-4">
              <div className="grow">
                <Input
                  id="descanso_semanal"
                  label="Descanso Semanal"
                  placeholder="2"
                  value={formValues?.descanso_semanal}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      descanso_semanal: currentTarget.value,
                    }))
                  }
                />
              </div>
              <div className="grow">
                <Input
                  id="inicio_atividades"
                  label="Início das Atividades"
                  type="date"
                  value={formValues.inicio_atividades}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      inicio_atividades: currentTarget.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="grow">
                <Input
                  id="data_desligamento"
                  label="Data de Desligamento"
                  type="date"
                  value={formValues.data_desligamento}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      data_desligamento: currentTarget.value,
                    }))
                  }
                />
              </div>
              <div className="grow">
                <Select
                  id="vinculo"
                  label="Vínculo*"
                  optionLabel="Selecione o vínculo"
                  options={[
                    { label: "Efetivo", value: "efetivo" },
                    { label: "Comissionado", value: "comissionado" },
                  ]}
                  required
                  value={formValues.vinculo}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      vinculo: currentTarget.value as Vinculo,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          
          {/* Curso e PDC */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
              <div className="grow">
                <Input
                  id="curso"
                  label="Curso (Opcional)"
                  placeholder="DIREITO"
                  value={formValues.curso}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      curso: currentTarget.value.toUpperCase(),
                    }))
                  }
                />
              </div>
              <div className="grow flex items-end pb-2">
                 <label className="flex items-center gap-2 font-medium text-slate-800">
                  <input
                    type="checkbox"
                    id="pdc"
                    checked={formValues.pdc}
                    onChange={({ currentTarget }) =>
                      setFormValues((prevValues) => ({
                        ...prevValues,
                        pdc: currentTarget.checked,
                      }))
                    }
                  />
                  PCD (Pessoa com Deficiência)
                </label>
              </div>
              <div className="flex gap-4">
                <div className="grow">
                  <Input
                    id="feriasinicio"
                    label="Início das Férias"
                    type="date"
                    // Verifica se o valor existe, senão usa string vazia
                    value={formValues.feriasinicio || ""} 
                    onChange={({ currentTarget }) =>
                      setFormValues((prevValues) => ({
                        ...prevValues,
                        feriasinicio: currentTarget.value,
                      }))
                    }
                  />
                </div>
                <div className="grow">
                  <Input
                    id="feriasfinal"
                    label="Final das Férias"
                    type="date"
                    // Verifica se o valor existe, senão usa string vazia
                    value={formValues.feriasfinal || ""} 
                    onChange={({ currentTarget }) =>
                      setFormValues((prevValues) => ({
                        ...prevValues,
                        feriasfinal: currentTarget.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Beneficiários */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex gap-4">
              <div className="flex grow flex-col gap-4">
                <h3 className="pb-4 text-2xl font-medium text-slate-800">
                  Beneficiarios - max: 14
                </h3>
                {formValues.beneficiarios?.map((beneficiario, index) => (
                  <div key={index}>
                    <div className="flex flex-col gap-2">
                      <Input
                        id={`nome_beneficiario_${index}`}
                        label="Nome"
                        placeholder="Robson Felipe Araujo"
                        value={beneficiario.nome}
                        onChange={({ currentTarget }) =>
                          handleChange(index, "nome", currentTarget.value)
                        }
                      />
                      <Input
                        id={`parentesco_beneficiario_${index}`}
                        label="Parentesco"
                        placeholder="filho(a)"
                        value={beneficiario.parentesco}
                        onChange={({ currentTarget }) =>
                          handleChange(index, "parentesco", currentTarget.value)
                        }
                      />
                      <Input
                        id={`data_beneficiario_${index}`}
                        label="Data de Nascimento"
                        value={beneficiario.data_nascimento}
                        type="date"
                        onChange={({ currentTarget }) =>
                          handleChange(
                            index,
                            "data_nascimento",
                            currentTarget.value,
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
                <div>
                  <Button type="button" onClick={handleAddBeneficiario}>
                    Adicionar Beneficiário
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-t-2 border-slate-200 my-4" />

          {/* --- TRANSFERÊNCIAS (Limite 19) --- */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-medium text-slate-800">
              Transferência e Remoção (Máx: 19)
            </h3>
            {formValues.transferencias?.map((transf, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="grow">
                    <Input
                        id={`transf_data_${index}`}
                        label="Data"
                        type="date"
                        value={transf.data_transferencia} 
                        onChange={(e) => handleTransferenciaChange(index, "data_transferencia", e.target.value)}
                    />
                </div>
                <div className="grow">
                    <Input
                        id={`transf_de_${index}`}
                        label="De (Lotação)"
                        placeholder="Setor Antigo"
                        value={transf.de_lotacao} 
                        onChange={(e) => handleTransferenciaChange(index, "de_lotacao", e.target.value)}
                    />
                </div>
                <div className="grow">
                    <Input
                        id={`transf_para_${index}`}
                        label="Para (Lotação)"
                        placeholder="Novo Setor"
                        value={transf.para_lotacao} 
                        onChange={(e) => handleTransferenciaChange(index, "para_lotacao", e.target.value)}
                    />
                </div>
                <Button 
                    type="button" 
                    onClick={() => handleRemoveTransferencia(index)}
                    className="bg-red-500 hover:bg-red-600 mb-1"
                >
                    Remover
                </Button>
              </div>
            ))}
            <div>
              <Button 
                type="button" 
                onClick={handleAddTransferencia}
                disabled={(formValues.transferencias?.length || 0) >= 19}
              >
                Adicionar Transferência
              </Button>
            </div>
          </div>

          <hr className="border-t-2 border-slate-200 my-4" />

          {/* --- FÉRIAS (Limite 10) --- */}
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-medium text-slate-800">
              Férias (Máx: 10)
            </h3>
            {formValues.ferias?.map((feria, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="grow">
                    <Input
                        id={`ferias_aquisicao_${index}`}
                        label="Período de Aquisição"
                        placeholder="Ex: 2023-2024"
                        value={feria.periodo_aquisicao}
                        onChange={(e) => handleFeriasChange(index, "periodo_aquisicao", e.target.value)}
                    />
                </div>
                <div className="grow">
                    <Input
                        id={`ferias_utilizacao_${index}`}
                        label="Período de Utilização"
                        placeholder="Ex: 01/05 a 30/05"
                        value={feria.periodo_utilizacao}
                        onChange={(e) => handleFeriasChange(index, "periodo_utilizacao", e.target.value)}
                    />
                </div>
                <Button 
                    type="button" 
                    onClick={() => handleRemoveFerias(index)}
                    className="bg-red-500 hover:bg-red-600 mb-1"
                >
                    Remover
                </Button>
              </div>
            ))}
            <div>
              <Button 
                type="button" 
                onClick={handleAddFerias}
                disabled={(formValues.ferias?.length || 0) >= 10}
              >
                Adicionar Férias
              </Button>
            </div>
          </div>

          <hr className="border-t-2 border-slate-200 my-4" />

          {/* --- OUTRAS ANOTAÇÕES --- */}
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-medium text-slate-800">Outras Anotações</h3>
            <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                rows={6}
                placeholder="Digite aqui anotações gerais sobre o servidor..."
                value={formValues.outras_anotacoes}
                onChange={(e) => setFormValues(prev => ({...prev, outras_anotacoes: e.target.value}))}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit">Atualizar Servidor</Button>
          <Button
            type="button"
            onClick={() =>
              setIsModalOpen({
                servidor: null,
                estagiario: null,
                modal: false,
                action: null,
              })
            }
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}