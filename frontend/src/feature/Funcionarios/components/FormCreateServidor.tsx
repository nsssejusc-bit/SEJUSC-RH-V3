import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { api } from "@/api";
import type { IEstagiario, IServidor, User } from "@/interfaces";
import { Button, Input, Select } from "@/shared";

// 1. Schema de validação com Zod
const servidorSchema = z.object({
  nome: z
    .string()
    .min(3, "O nome completo é obrigatório.")
    .transform((val) => val.toUpperCase()),
  secretaria_lotacao: z // Renomeado
    .string()
    .min(1, "A Secretaria/Lotação é obrigatória.")
    .transform((val) => val.toUpperCase()),
  matricula: z.string().optional(),
  cargo: z
    .string()
    .min(1, "O cargo é obrigatório.")
    .transform((val) => val.toUpperCase()),
  entrada: z.enum(["08:00"], {
    message: "Selecione o horário de entrada.",
  }),
  saida: z.enum(["14:00", "17:00"], {
    message: "Selecione o horário de saída.",
  }),
  data_nascimento: z
    .string()
    .date("A data de nascimento deve ser uma data válida."),
  sexo: z.enum(["MASCULINO", "FEMININO", "OUTRO"], {
    message: "Selecione o sexo.",
  }),
  estado_civil: z.enum(["SOLTEIRO", "CASADO", "DIVORCIADO", "VIUVO"], {
    message: "Selecione o estado civil.",
  }),
  naturalidade: z
    .string()
    .min(1, "A naturalidade é obrigatória.")
    .transform((val) => val.toUpperCase()),
  nacionalidade: z
    .string()
    .min(1, "A nacionalidade é obrigatória.")
    .transform((val) => val.toUpperCase()),
  identidade: z.string().min(1, "O número da identidade é obrigatório."),
  titulo_eleitor: z
    .string()
    .length(12, "O título de eleitor deve ter 12 dígitos."),
  cpf: z
    .string()
    .regex(
      /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
      "Formato de CPF inválido (ex: 000.000.000-00)",
    ),
  pis: z
    .string()
    .regex(
      /^\d{3}\.\d{5}\.\d{2}-\d{1}$/,
      "Formato de PIS inválido (ex: 000.00000.00-0)",
    )
    .optional(),
  data_admissao: z
    .string()
    .date("A data de admissão deve ser uma data válida."),
  endereco: z
    .string()
    .min(1, "O endereço é obrigatório.")
    .transform((val) => val.toUpperCase()),
  nome_pai: z
    .string()
    .optional()
    .transform((val) => (val ? val.toUpperCase() : val)),
  nome_mae: z
    .string()
    .min(1, "O nome da mãe é obrigatório.")
    .transform((val) => val.toUpperCase()),
  servico_militar: z.string().optional(),
  carteira_profissional: z
    .string()
    .min(1, "A carteira profissional é obrigatória."),
  data_posse: z.string().date("A data da posse deve ser uma data válida."),

  // Novos Campos Servidor
  vinculo: z.enum(["efetivo", "comissionado"], {
    message: "Selecione o vínculo.",
  }),
  curso: z.string().optional().transform((val) => (val ? val.toUpperCase() : val)),
  pdc: z.boolean().default(false).optional(),
});

// 2. Inferir o tipo dos dados do formulário a partir do schema
type ServidorFormData = z.infer<typeof servidorSchema>;

type FormCreateServidorProps = {
  setIsModalOpen: React.Dispatch<
    React.SetStateAction<{
      servidor: IServidor | null;
      estagiario: IEstagiario | null;
      modal: boolean;
      action: string | null;
    }>
  >;
};

export default function FormCreateServidor({
  setIsModalOpen,
}: FormCreateServidorProps) {
  // 3. Inicializar o React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ServidorFormData>({
    resolver: zodResolver(servidorSchema),
    mode: "onChange", // Valida os campos em tempo real
  });

  const storedUser = JSON.parse(localStorage.getItem("user")!) as User;

  const historyLogsCreate = async (
    user: string,
    nome: string,
    setor: string,
  ) => {
    try {
      await api.post("/historico-logs", {
        mensagem: `O usuario de nome ${user} cadastrou o servidor ${nome} do setor ${setor}`,
        nome: nome,
        acao: "Cadastrar",
      });
    } catch (error) {
      console.log("Erro ao criar o log", error);
    }
  };

  // 4. Função de submit que só é chamada se a validação passar
  const onSubmit: SubmitHandler<ServidorFormData> = async (data) => {
    try {
      await api.post("/criar/servidores", {
        ...data, // Envia todos os dados validados e transformados
        horario: `${data.entrada}-${data.saida}`,
        entrada: data.entrada, // Zod já garante '08:00'
        saida: data.saida, // Zod já garante '14:00' ou '17:00'
        data_admissao: data.data_admissao,
        // 'secretaria_lotacao' já está em 'data'
      });

      await historyLogsCreate(storedUser.nome, data.nome, data.secretaria_lotacao);
      toast.success("Servidor cadastrado com sucesso!");
      reset(); // Limpa o formulário
    } catch (error) {
      console.log("Erro ao cadastrar servidor:", error);
      toast.error("Não foi possível realizar o cadastro. Verifique os dados.");
    }
  };

  const ErrorMessage = ({ message }: { message?: string }) => {
    return message ? (
      <p className="mt-1 text-sm text-red-600">{message}</p>
    ) : null;
  };

  return (
    <div>
      <h1 className="pb-8 text-4xl font-semibold text-sky-950">
        Cadastrar Servidor
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
        <div className="flex flex-col gap-6">
          {/* --- BLOCO 1: INFORMAÇÕES PESSOAIS --- */}
          <div>
            <Input
              id="nome"
              label="Nome Completo*"
              placeholder="JOSÉ AUGUSTO LISBOA FILHO"
              {...register("nome")}
            />
            <ErrorMessage message={errors.nome?.message} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                id="data_nascimento"
                label="Data de Nascimento*"
                type="date"
                {...register("data_nascimento")}
              />
              <ErrorMessage message={errors.data_nascimento?.message} />
            </div>
            <div>
              <Select
                id="sexo"
                label="Sexo*"
                optionLabel="Selecione uma opção"
                options={[
                  { label: "MASCULINO", value: "MASCULINO" },
                  { label: "FEMININO", value: "FEMININO" },
                  { label: "OUTRO", value: "OUTRO" },
                ]}
                {...register("sexo")}
              />
              <ErrorMessage message={errors.sexo?.message} />
            </div>
          </div>

          <div>
            <Select
              id="estado_civil"
              label="Estado Civil*"
              optionLabel="Selecione uma opção"
              options={[
                { label: "SOLTEIRO", value: "SOLTEIRO" },
                { label: "CASADO", value: "CASADO" },
                { label: "DIVORCIADO", value: "DIVORCIADO" },
                { label: "VIÚVO", value: "VIUVO" },
              ]}
              {...register("estado_civil")}
            />
            <ErrorMessage message={errors.estado_civil?.message} />
          </div>

          {/* --- BLOCO 2: DOCUMENTOS E NÚMEROS --- */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                id="cpf"
                label="CPF*"
                placeholder="000.000.000-00"
                {...register("cpf")}
              />
              <ErrorMessage message={errors.cpf?.message} />
            </div>
            <div>
              <Input
                id="identidade"
                label="Identidade*"
                placeholder="0000000-0"
                {...register("identidade")}
              />
              <ErrorMessage message={errors.identidade?.message} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                id="titulo_eleitor"
                label="Título de Eleitor*"
                placeholder="000000000000"
                {...register("titulo_eleitor")}
              />
              <ErrorMessage message={errors.titulo_eleitor?.message} />
            </div>
            <div>
              <Input
                id="carteira_profissional"
                label="Carteira Profissional*"
                placeholder="000000/AM"
                {...register("carteira_profissional")}
              />
              <ErrorMessage message={errors.carteira_profissional?.message} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                id="matricula"
                label="Matrícula (Opcional)"
                placeholder="123.456-7 A"
                {...register("matricula")}
              />
              <ErrorMessage message={errors.matricula?.message} />
            </div>
            <div>
              <Input
                id="pis"
                label="PIS/PASEP (Opcional)"
                placeholder="000.00000.00-0"
                {...register("pis")}
              />
              <ErrorMessage message={errors.pis?.message} />
            </div>
          </div>

          <div>
            <Input
              id="servico_militar"
              label="Serviço Militar (Opcional)"
              placeholder="Número do certificado"
              {...register("servico_militar")}
            />
            <ErrorMessage message={errors.servico_militar?.message} />
          </div>

          {/* --- BLOCO 3: LOCALIZAÇÃO --- */}
          <div>
            <Input
              id="endereco"
              label="Endereço*"
              placeholder="AVENIDA DOS TESTES, 456, BAIRRO DA INTERFACE, SÃO PAULO-SP"
              {...register("endereco")}
            />
            <ErrorMessage message={errors.endereco?.message} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                id="nacionalidade"
                label="Nacionalidade*"
                placeholder="BRASILEIRA"
                {...register("nacionalidade")}
              />
              <ErrorMessage message={errors.nacionalidade?.message} />
            </div>
            <div>
              <Input
                id="naturalidade"
                label="Naturalidade*"
                placeholder="MANAUS/AM"
                {...register("naturalidade")}
              />
              <ErrorMessage message={errors.naturalidade?.message} />
            </div>
          </div>

          {/* --- BLOCO 4: FILIAÇÃO --- */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                id="nome_mae"
                label="Nome da Mãe*"
                placeholder="MARIA DE FÁTIMA BEZERRA MATOS"
                {...register("nome_mae")}
              />
              <ErrorMessage message={errors.nome_mae?.message} />
            </div>
            <div>
              <Input
                id="nome_pai"
                label="Nome do Pai (Opcional)"
                placeholder="CARLOS ARAUJO DE SOUZA MATOS"
                {...register("nome_pai")}
              />
              <ErrorMessage message={errors.nome_pai?.message} />
            </div>
          </div>

          {/* --- BLOCO 5: INFORMAÇÕES FUNCIONAIS E HORÁRIOS --- */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                id="cargo"
                label="Cargo*"
                placeholder="ASSESSOR I"
                {...register("cargo")}
              />
              <ErrorMessage message={errors.cargo?.message} />
            </div>
            <div>
              <Input
                id="secretaria_lotacao" // Renomeado
                label="Secretaria/Lotação*" // Renomeado
                placeholder="SECEX/ASCOM"
                {...register("secretaria_lotacao")} // Renomeado
              />
              <ErrorMessage message={errors.secretaria_lotacao?.message} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select
                id="entrada"
                label="Entrada*"
                optionLabel="Selecione uma opção"
                options={[{ label: "08:00", value: "08:00" }]}
                {...register("entrada")}
              />
              <ErrorMessage message={errors.entrada?.message} />
            </div>
            <div>
              <Select
                id="saida"
                label="Saída*"
                optionLabel="Selecione uma opção"
                options={[
                  { label: "14:00", value: "14:00" },
                  { label: "17:00", value: "17:00" },
                ]}
                {...register("saida")}
              />
              <ErrorMessage message={errors.saida?.message} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                id="data_admissao"
                label="Data de Admissão*"
                type="date"
                {...register("data_admissao")}
              />
              <ErrorMessage message={errors.data_admissao?.message} />
            </div>
            <div>
              <Input
                id="data_posse"
                label="Data da Posse*"
                type="date"
                {...register("data_posse")}
              />
              <ErrorMessage message={errors.data_posse?.message} />
            </div>
          </div>
          
          {/* --- BLOCO 6: NOVOS CAMPOS --- */}
          <div className="grid grid-cols-2 gap-4">
             <div>
              <Select
                id="vinculo"
                label="Vínculo*"
                optionLabel="Selecione o vínculo"
                options={[
                  { label: "Efetivo", value: "efetivo" },
                  { label: "Comissionado", value: "comissionado" },
                ]}
                {...register("vinculo")}
              />
              <ErrorMessage message={errors.vinculo?.message} />
            </div>
            <div>
              <Input
                id="curso"
                label="Curso (Opcional)"
                placeholder="DIREITO"
                {...register("curso")}
              />
              <ErrorMessage message={errors.curso?.message} />
            </div>
          </div>
          
          <div>
            <label className="flex items-center gap-2 font-medium text-slate-800">
              <input
                type="checkbox"
                id="pdc"
                {...register("pdc")}
              />
              PCD (Pessoa com Deficiência)
            </label>
            <ErrorMessage message={errors.pdc?.message} />
          </div>

        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit">Cadastrar Servidor</Button>
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