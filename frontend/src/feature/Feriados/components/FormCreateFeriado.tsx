import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";

import { api } from "@/api";
import { Button, Input, Select } from "@/shared";

const feriadoSchema = z.object({
  data: z.string().min(1, "A data é obrigatória."),
  descricao: z.string().min(3, "A descrição é obrigatória."),
  tipo: z.enum(["feriado", "ponto_facultativo"]),
  estado: z.string().default("AM"),
});

type FeriadoFormData = z.infer<typeof feriadoSchema>;

export default function FormCreateFeriado() {
  const qc = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FeriadoFormData>({
    resolver: zodResolver(feriadoSchema),
    defaultValues: {
      tipo: "feriado",
      estado: "AM",
    },
  });

  const onSubmit: SubmitHandler<FeriadoFormData> = async (data) => {
    try {
      const payload = {
        data: data.data, // "yyyy-mm-dd" do input[type=date]
        descricao: data.descricao,
        estado: data.estado,
        // backend espera 0/1
        ponto_facultativo: data.tipo === "ponto_facultativo" ? 1 : 0,
      };

      await api.post("/feriados-municipais", payload);

      // Atualiza o calendário (React Query)
      qc.invalidateQueries({ queryKey: ["feriados"] });

      toast.success("Data cadastrada com sucesso!");
      reset({ tipo: "feriado", estado: "AM", data: "", descricao: "" });
    } catch (error: any) {
      const msg = error?.response?.data?.erro ?? "Não foi possível cadastrar a data.";
      console.error("Erro ao cadastrar feriado:", error);
      toast.error(msg);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-lg flex-col gap-6 rounded-lg bg-white p-8 shadow-md"
    >
      <div>
        <Input id="data" label="Data" type="date" {...register("data")} />
        {errors.data && (
          <p className="mt-1 text-sm text-red-600">{errors.data.message}</p>
        )}
      </div>

      <div>
        <Input
          id="descricao"
          label="Descrição"
          placeholder="Ex: Aniversário de Manaus"
          {...register("descricao")}
        />
        {errors.descricao && (
          <p className="mt-1 text-sm text-red-600">
            {errors.descricao.message}
          </p>
        )}
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="font-medium text-slate-800">Tipo</legend>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" value="feriado" {...register("tipo")} />
            Feriado
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" value="ponto_facultativo" {...register("tipo")} />
            Ponto Facultativo
          </label>
        </div>
      </fieldset>

      <div>
        <Select
          id="estado"
          label="Estado"
          optionLabel="Selecione um estado"
          options={[{ label: "Amazonas", value: "AM" }]}
          {...register("estado")}
        />
      </div>

      <Button type="submit" className="mt-4">
        CADASTRAR DATA
      </Button>
    </form>
  );
}
