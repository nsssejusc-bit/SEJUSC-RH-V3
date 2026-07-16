import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { api } from "@/api";
import type { IEstagiario, IServidor, User } from "@/interfaces";
import { Button, Input, Select } from "@/shared";

// Schema e tipo de dados definidos acima
const estagiarioSchema = z.object({
  nome: z
    .string()
    .min(3, "O nome completo é obrigatório.")
    .transform((val) => val.toUpperCase()),
  secretaria_lotacao: z // Renomeado
    .string()
    .min(1, "A Secretaria/Lotação é obrigatória.")
    .transform((val) => val.toUpperCase()),
  cargo: z.literal("ESTAGIÁRIO").default("ESTAGIÁRIO"), // Cargo padrão
  entrada: z.enum(["08:00", "11:00"], {
    message: "Selecione o horário de entrada.",
  }),
  saida: z.enum(["14:00", "17:00"], {
    message: "Selecione o horário de saída.",
  }),
  // Novos Campos
  curso: z
    .string()
    .min(2, "O curso é obrigatório.")
    .transform((val) => val.toUpperCase()),
  inicioContrato: z.string().date("A data de início do contrato é obrigatória."),
  finalContrato: z.string().date("A data final do contrato é obrigatória."),
});

type EstagiarioFormData = z.infer<typeof estagiarioSchema>;

type FormCreateEstagiarioProps = {
  setIsModalOpen: React.Dispatch<
    React.SetStateAction<{
      servidor: IServidor | null;
      estagiario: IEstagiario | null;
      modal: boolean;
      action: string | null;
    }>
  >;
};

export default function FormCreateEstagiario({
  setIsModalOpen,
}: FormCreateEstagiarioProps) {
  // 1. Inicializa o React Hook Form com o Zod Resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EstagiarioFormData>({
    resolver: zodResolver(estagiarioSchema),
    defaultValues: {
      nome: "",
      secretaria_lotacao: "",
      cargo: "ESTAGIÁRIO",
    },
  });

  const storedUser = JSON.parse(localStorage.getItem("user")!) as User;

  const historyLogsCreate = async (
    user: string,
    nome: string,
    setor: string,
  ) => {
    try {
      await api.post("/historico-logs", {
        mensagem: `O usuario de nome ${user} cadastrou o estagiário ${nome} do setor ${setor}`,
        nome: nome,
        acao: "Cadastrar",
      });
    } catch (error) {
      console.log("Erro ao criar o log", error);
    }
  };

  // 2. Função de submit tipada que só será executada com dados válidos
  const onSubmit: SubmitHandler<EstagiarioFormData> = async (data) => {
    try {
      await api.post("/estagiarios", {
        ...data, // Envia todos os dados do schema
        horario: `${data.entrada}-${data.saida}`,
        // 'secretaria_lotacao', 'curso', 'inicioContrato', 'finalContrato' já estão em 'data'
      });

      await historyLogsCreate(storedUser.nome, data.nome, data.secretaria_lotacao);
      toast.success("Estagiário cadastrado com sucesso!");
      reset(); // Limpa o formulário
    } catch (error) {
      console.log("Erro ao cadastrar estagiário:", error);
      toast.error("Não foi possível realizar o cadastro");
    }
  };

  // Componente auxiliar para exibir mensagens de erro
  const ErrorMessage = ({ message }: { message?: string }) => {
    return message ? (
      <p className="mt-1 text-sm text-red-600">{message}</p>
    ) : null;
  };

  return (
    <div>
      <h1 className="pb-8 text-4xl font-semibold text-sky-950">
        Cadastrar Estagiário
      </h1>
      {/* 3. Liga o formulário ao handleSubmit */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
        <div className="flex flex-col gap-6">
          <div>
            <Input
              id="nome"
              label="Nome Completo*"
              placeholder="YURI ODILON NOGUEIRA MOURA"
              {...register("nome")}
            />
            <ErrorMessage message={errors.nome?.message} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                id="secretaria_lotacao" // Renomeado
                label="Secretaria/Lotação*" // Renomeado
                placeholder="SECEX/ASCOM"
                {...register("secretaria_lotacao")} // Renomeado
              />
              <ErrorMessage message={errors.secretaria_lotacao?.message} />
            </div>
            <div>
              <Input
                id="cargo"
                label="Cargo*"
                readOnly
                defaultValue="Estagiário"
                {...register("cargo")}
              />
              <ErrorMessage message={errors.cargo?.message} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select
                id="entrada"
                label="Entrada*"
                optionLabel="selecione uma opção"
                options={[
                  { label: "08:00", value: "08:00" },
                  { label: "11:00", value: "11:00" },
                ]}
                {...register("entrada")}
              />
              <ErrorMessage message={errors.entrada?.message} />
            </div>
            <div>
              <Select
                id="saida"
                label="Saída*"
                optionLabel="selecione uma opção"
                options={[
                  { label: "14:00", value: "14:00" },
                  { label: "17:00", value: "17:00" },
                ]}
                {...register("saida")}
              />
              <ErrorMessage message={errors.saida?.message} />
            </div>
          </div>

          {/* Novos Campos Estagiário */}
          <div>
            <Input
              id="curso"
              label="Curso*"
              placeholder="SISTEMAS DE INFORMAÇÃO"
              {...register("curso")}
            />
            <ErrorMessage message={errors.curso?.message} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                id="inicioContrato"
                label="Início do Contrato*"
                type="date"
                {...register("inicioContrato")}
              />
              <ErrorMessage message={errors.inicioContrato?.message} />
            </div>
            <div>
              <Input
                id="finalContrato"
                label="Final do Contrato*"
                type="date"
                {...register("finalContrato")}
              />
              <ErrorMessage message={errors.finalContrato?.message} />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit">Cadastrar Estagiário</Button>
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