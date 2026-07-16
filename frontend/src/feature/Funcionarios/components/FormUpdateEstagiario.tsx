import React from "react";

import type { IEstagiario, IServidor } from "@/interfaces";
import { Button,Input, Select } from "@/shared";

import useFormUpdateEstagiaro from "../hooks/useFormUpdateEstagiaro";

type Entrada = "" | "08:00" | "11:00";
type Saida = "" | "14:00" | "17:00";

type FormUpdateEstagiarioProps = {
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

export default function FormUpdateEstagiario({
  isModalOpen,
  setIsModalOpen,
}: FormUpdateEstagiarioProps) {
  const { estagiario } = isModalOpen;

  const { handleSubmit, setFormValues, formValues } =
    useFormUpdateEstagiaro(estagiario);

  return (
    <div>
      <h1 className="pb-8 text-4xl font-semibold text-sky-950">
        Atualizar Estagiário
      </h1>
      <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <Input
            id="nome"
            label="Nome Completo*"
            placeholder="Yuri Odilon Nogueira Moura"
            value={formValues.nome}
            onChange={({ currentTarget }) =>
              setFormValues((prevValues) => ({
                ...prevValues,
                nome: currentTarget.value.toUpperCase(),
              }))
            }
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex gap-4">
              <div className="grow">
                <Input
                  id="secretaria_lotacao" // Renomeado
                  label="Secretaria/Lotação*" // Renomeado
                  placeholder="SECEX/ASCOM"
                  required
                  value={formValues.secretaria_lotacao} // Renomeado
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      secretaria_lotacao: currentTarget.value.toUpperCase(), // Renomeado
                    }))
                  }
                />
              </div>
              <div className="grow">
                <Input
                  id="cargo"
                  label="Cargo*"
                  required
                  defaultValue="Estagiário"
                  readOnly
                  value={formValues.cargo}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      cargo: currentTarget.value.toUpperCase(),
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="grow">
                <Select
                  id="entrada"
                  label="Entrada*"
                  optionLabel="selecione uma opção"
                  options={[
                    { label: "08:00", value: "08:00" },
                    { label: "11:00", value: "11:00" },
                  ]}
                  required
                  value={formValues.horario_entrada}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      horario_entrada: currentTarget.value as Entrada,
                    }))
                  }
                />
              </div>
              <div className="grow">
                <Select
                  id="saida"
                  label="Saida*"
                  optionLabel="selecione uma opção"
                  options={[
                    { label: "14:00", value: "14:00" },
                    { label: "17:00", value: "17:00" },
                  ]}
                  required
                  value={formValues.horario_saida}
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      horario_saida: currentTarget.value as Saida,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             {/* Novos Campos */}
            <div>
              <Input
                id="curso"
                label="Curso*"
                placeholder="SISTEMAS DE INFORMAÇÃO"
                required
                value={formValues.curso}
                onChange={({ currentTarget }) =>
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    curso: currentTarget.value.toUpperCase(),
                  }))
                }
              />
            </div>
             <div className="flex gap-4">
                <div className="grow">
                    <Input
                    id="inicioContrato"
                    label="Início do Contrato*"
                    type="date"
                    required
                    value={formValues.inicioContrato}
                    onChange={({ currentTarget }) =>
                        setFormValues((prevValues) => ({
                        ...prevValues,
                        inicioContrato: currentTarget.value,
                        }))
                    }
                    />
                </div>
                <div className="grow">
                    <Input
                    id="finalContrato"
                    label="Final do Contrato*"
                    type="date"
                    required
                    value={formValues.finalContrato}
                    onChange={({ currentTarget }) =>
                        setFormValues((prevValues) => ({
                        ...prevValues,
                        finalContrato: currentTarget.value,
                        }))
                    }
                    />
                </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Campos Renomeados */}
            <div className="flex gap-4">
              <div className="grow">
                <Input
                  id="recessoinicio" // Renomeado
                  label="Início do Recesso*" // Renomeado
                  type="date"
                  required
                  value={formValues.recessoinicio} // Renomeado
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      recessoinicio: currentTarget.value, // Renomeado
                    }))
                  }
                />
              </div>
              <div className="grow">
                <Input
                  id="recessofinal" // Renomeado
                  label="Final do Recesso*" // Renomeado
                  type="date"
                  required
                  value={formValues.recessofinal} // Renomeado
                  onChange={({ currentTarget }) =>
                    setFormValues((prevValues) => ({
                      ...prevValues,
                      recessofinal: currentTarget.value, // Renomeado
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit">Atualizar Estagiário</Button>
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