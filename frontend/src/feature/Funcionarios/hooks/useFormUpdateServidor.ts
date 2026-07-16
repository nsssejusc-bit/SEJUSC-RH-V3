useFormUpdateServidor

import React from "react";
import { toast } from "sonner";

import { api } from "@/api";
import type { IServidor, IUpdateServidor, User, ITransferencia, IFerias } from "@/interfaces";

export default function useFormUpdateServidor(servidor: IServidor | null) {
  const storedUser = JSON.parse(localStorage.getItem("user")!) as User;

  const historyLogsUpdate = async (
    user: string,
    nome: string,
    setor: string,
  ) => {
    try {
      await api.post("/historico-logs", {
        mensagem: `O usuario de nome ${user} atualizou o servidor ${nome} do setor ${setor}`,
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

  const [formValues, setFormValues] = React.useState<IUpdateServidor>({
    nome: servidor?.nome || "",
    secretaria_lotacao: servidor?.secretaria_lotacao || "",
    matricula: servidor?.matricula || "",
    cargo: servidor?.cargo || "",
    horario: "",
    horarioentrada: servidor?.horarioentrada || "",
    horariosaida: servidor?.horariosaida || "",
    sexo: servidor?.sexo || "",
    estado_civil: servidor?.estado_civil || "",
    naturalidade: servidor?.naturalidade || "",
    nacionalidade: servidor?.nacionalidade || "",
    identidade: servidor?.identidade || "",
    titulo_eleitor: servidor?.titulo_eleitor || "",
    cpf: servidor?.cpf || "",
    pis: servidor?.pis || "",
    endereco: servidor?.endereco || "",
    nome_pai: servidor?.nome_pai || "",
    nome_mae: servidor?.nome_mae || "",
    servico_militar: servidor?.servico_militar || "",
    carteira_profissional: servidor?.carteira_profissional || "",
    descanso_semanal: servidor?.descanso_semanal || "",
    vencimento_ou_salario: servidor?.vencimento_ou_salario || "",
    data_nascimento: formatedDate(servidor?.data_nascimento),
    data_Admissao: formatedDate(servidor?.data_Admissao),
    data_posse: formatedDate(servidor?.data_posse),
    inicio_atividades: formatedDate(servidor?.inicio_atividades),
    data_desligamento: formatedDate(servidor?.data_desligamento),
    
    feriasinicio: formatedDate((servidor as any)?.feriasinicio),
    feriasfinal: formatedDate((servidor as any)?.feriasfinal),

    vinculo: servidor?.vinculo || "",
    curso: servidor?.curso || "",
    pdc: servidor?.pdc || false,
    
    beneficiarios: (servidor as any)?.beneficiarios || [{ nome: "", parentesco: "", data_nascimento: "" }],

    // --- NOVOS CAMPOS ---
    outras_anotacoes: servidor?.outras_anotacoes || "",
    
    transferencias: servidor?.transferencias?.length 
      ? servidor.transferencias 
      : [], 
      
    ferias: servidor?.ferias?.length 
      ? servidor.ferias 
      : [],
  });

  // --- FUNÇÕES DE TRANSFERÊNCIA ---
  const handleAddTransferencia = () => {
    setFormValues((prev) => {
      const atuais = prev.transferencias || [];
      if (atuais.length >= 19) return prev;
      return {
        ...prev,
        transferencias: [...atuais, { data_transferencia: "", de_lotacao: "", para_lotacao: "" }],
      };
    });
  };

  const handleTransferenciaChange = (index: number, field: keyof ITransferencia, value: string) => {
    setFormValues((prev) => {
      const updated = [...(prev.transferencias || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, transferencias: updated };
    });
  };

  const handleRemoveTransferencia = (index: number) => {
    setFormValues((prev) => {
      const updated = [...(prev.transferencias || [])];
      updated.splice(index, 1);
      return { ...prev, transferencias: updated };
    });
  };

  // --- FUNÇÕES DE FÉRIAS ---
  const handleAddFerias = () => {
    setFormValues((prev) => {
      const atuais = prev.ferias || [];
      if (atuais.length >= 10) return prev;
      return {
        ...prev,
        ferias: [...atuais, { periodo_aquisicao: "", periodo_utilizacao: "" }],
      };
    });
  };

  const handleFeriasChange = (index: number, field: keyof IFerias, value: string) => {
    setFormValues((prev) => {
      const updated = [...(prev.ferias || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, ferias: updated };
    });
  };

  const handleRemoveFerias = (index: number) => {
    setFormValues((prev) => {
      const updated = [...(prev.ferias || [])];
      updated.splice(index, 1);
      return { ...prev, ferias: updated };
    });
  };


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const tempPayload = {
        nome: formValues.nome,
        secretaria_lotacao: formValues.secretaria_lotacao,
        matricula: formValues.matricula,
        cargo: formValues.cargo,

        horario:
          formValues.horarioentrada && formValues.horariosaida
            ? `${formValues.horarioentrada}-${formValues.horariosaida}`
            : "",

        horarioentrada: formValues.horarioentrada,
        horariosaida: formValues.horariosaida,
        sexo: formValues.sexo,
        estado_civil: formValues.estado_civil,
        naturalidade: formValues.naturalidade,
        nacionalidade: formValues.nacionalidade,
        identidade: formValues.identidade,
        titulo_eleitor: formValues.titulo_eleitor,
        cpf: formValues.cpf,
        pis: formValues.pis,
        endereco: formValues.endereco,
        nome_pai: formValues.nome_pai,
        nome_mae: formValues.nome_mae,
        servico_militar: formValues.servico_militar,
        carteira_profissional: formValues.carteira_profissional,
        descanso_semanal: formValues.descanso_semanal,
        vencimento_ou_salario: formValues?.vencimento_ou_salario,
        data_nascimento: formValues.data_nascimento,
        data_Admissao: formValues.data_Admissao,
        data_posse: formValues.data_posse,
        inicio_atividades: formValues.inicio_atividades,
        data_desligamento: formValues.data_desligamento,

        feriasinicio: formValues.feriasinicio,
        feriasfinal: formValues.feriasfinal,

        vinculo: formValues.vinculo,
        curso: formValues.curso,
        pdc: formValues.pdc,

        // --- DADOS NOVOS ---
        outras_anotacoes: formValues.outras_anotacoes,

        transferencias: (formValues.transferencias || []).filter(
          (t) => t.data_transferencia !== "" || t.de_lotacao !== "" || t.para_lotacao !== ""
        ),

        ferias: (formValues.ferias || []).filter(
          (f) => f.periodo_aquisicao !== "" || f.periodo_utilizacao !== ""
        ),

        beneficiarios: (formValues.beneficiarios || []).filter(
          (b) =>
            b.nome !== "" && b.parentesco !== "" && b.data_nascimento !== "",
        ),
      };

      const payload = Object.fromEntries(
        Object.entries(tempPayload).filter(([_, value]) => {
          if (value === null || value === undefined || value === "") {
            if (_ === 'pdc' && (value as any) === false) {
              return true;
            }
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
        payload.secretaria_lotacao as string,
      );

      await api.patch(`/servidores/${servidor?.id}`, payload);
      toast.success("Servidor atualizado com sucesso!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log("Erro ao atualizar servidor:", error);
      toast.error("Não foi possível realizar a atualização");
    }
  };

  const handleChange = (index: number, field: string, value: string) => {
    setFormValues((prevData) => {
      const beneficiariosArray = prevData.beneficiarios || [];
      const updated = [...beneficiariosArray];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return {
        ...prevData,
        beneficiarios: updated,
      };
    });
  };

  const handleAddBeneficiario = () => {
    setFormValues((prevData) => ({
      ...prevData,
      beneficiarios: [
        ...(prevData.beneficiarios || []),
        { nome: "", parentesco: "", data_nascimento: "" },
      ],
    }));
  };

  return {
    handleSubmit,
    handleChange,
    handleAddBeneficiario,
    setFormValues,
    formValues,
    
    handleAddTransferencia,
    handleTransferenciaChange,
    handleRemoveTransferencia,
    handleAddFerias,
    handleFeriasChange,
    handleRemoveFerias,
  };
}