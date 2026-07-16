import React from "react";
import { toast } from "sonner";

import { api } from "@/api";
import type { IEstagiario, User } from "@/interfaces";

export default function useFormUpdateEstagiaro(estagiario: IEstagiario | null) {
  const storedUser = JSON.parse(localStorage.getItem("user")!) as User;

  const historyLogsUpdate = async (
    user: string,
    nome: string,
    setor: string,
  ) => {
    try {
      await api.post("/historico-logs", {
        mensagem: `O usuario de nome ${user} atualizou o estagiário ${nome} do setor ${setor}`, // Mensagem ajustada
        nome: nome,
        acao: "Atualizar",
      });
    } catch (error) {
      console.log("Erro ao criar o log", error);
    }
  };

  const formatedDate = (data_criacao: string | null | undefined) => {
    if (!data_criacao) {
      return "";
    }

    const dataObjeto = new Date(data_criacao);
    const dia = String(dataObjeto.getUTCDate()).padStart(2, "0");
    const mes = String(dataObjeto.getUTCMonth() + 1).padStart(2, "0");
    const ano = dataObjeto.getUTCFullYear();

    return `${ano}-${mes}-${dia}`;
  };

  const [formValues, setFormValues] = React.useState<IEstagiario>({
    nome: estagiario?.nome || "",
    secretaria_lotacao: estagiario?.secretaria_lotacao || "", // Renomeado
    cargo: estagiario?.cargo || "ESTAGIÁRIO",
    horario: estagiario?.horario || "",
    horario_entrada: estagiario?.horario_entrada || "",
    horario_saida: estagiario?.horario_saida || "",
    recessoinicio: formatedDate(estagiario?.recessoinicio), // Renomeado
    recessofinal: formatedDate(estagiario?.recessofinal), // Renomeado
    
    // Novos campos
    curso: estagiario?.curso || "",
    inicioContrato: formatedDate(estagiario?.inicioContrato),
    finalContrato: formatedDate(estagiario?.finalContrato),
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const tempPayload = {
        nome: formValues.nome,
        secretaria_lotacao: formValues.secretaria_lotacao, // Renomeado
        cargo: "ESTAGIÁRIO",
        horario: `${formValues.horario_entrada}-${formValues.horario_saida}`,
        entrada: formValues.horario_entrada,
        saida: formValues.horario_saida,
        recessoinicio: formValues.recessoinicio, // Renomeado
        recessofinal: formValues.recessofinal, // Renomeado
        
        // Novos campos
        curso: formValues.curso,
        inicioContrato: formValues.inicioContrato,
        finalContrato: formValues.finalContrato,
      };

      const payload = Object.fromEntries(
        Object.entries(tempPayload).filter(([_, value]) => {
          if (value === null || value === undefined || value === "") {
            return false;
          }

          if (Array.isArray(value) && value.length === 0) {
            return false;
          }

          return true;
        }),
      );

      await historyLogsUpdate(
        storedUser.nome,
        payload.nome as string,
        payload.secretaria_lotacao as string, // Renomeado
      );

      await api.put(`/estagiarios/${estagiario?.id}`, payload);
      toast.success("Estagiário atualizado com sucesso!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log("Erro ao atualizar estagiário:", error);
      toast.error("Não foi possível realizar a atualização");
    }
  };

  return {
    handleSubmit,
    setFormValues,
    formValues,
  };
}