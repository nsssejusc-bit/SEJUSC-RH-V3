import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";

import { api } from "@/api";
import useAuth from "@/context/useAuth";
import type { User } from "@/interfaces/index";

// --- Alteração 1: Mudança 'matricula' para 'identificador' no Schema ---
const formSchema = z.object({
  identificador: z // <- Alterado
    .string()
    .min(5, {
      message:
        "Matrícula/CPF deve ter pelo menos 5 caracteres. Ex: 000.000-0 A ou 00000 ou 12345678900", // <- Mensagem atualizada
    })
    .max(14, { // <- Aumentado para suportar CPF formatado
      message:
        "Matrícula/CPF deve ter no máximo 14 caracteres.", // <- Mensagem atualizada
    }),
  password: z.string().min(8, {
    message: "A senha deve ter pelo menos 8 caracteres.",
  }),
  term: z.boolean({ message: "Você deve aceitar os termos para continuar" }),
});

export default function useFormLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [passwordVisibility, setPasswordVisibility] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // --- Alteração 2: Mudar 'matricula' para 'identificador' ---
      identificador: "", // <- Alterado
      password: "",
      term: false,
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      // --- Alteração 3: Enviar 'identificador' para a API ---
      const response = await api.post("/login", {
        identificador: values.identificador, // <- Alterado
        senha: values.password,
        termo: values.term,
      });
      return response.data as User;
    },
    onSuccess: (response) => {
      const storedUser = {
        nome: response.nome,
        role: response.role,
        cargo: response.cargo,
      };

      localStorage.setItem("user", JSON.stringify(storedUser));
      toast.success("Usuário autenticado!");
      login(storedUser);
      navigate("/dashboard");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const { response } = error;
        if (response?.status === 404) {
          toast.error("Error 404", { description: "Usuário não encontrado." });
          return;
        }
        if (response?.status === 401) {
          toast.error("Error 401", { description: "Usuário não autorizado." });
          return;
        }
        toast.error("Error HTTP", {
          description:
            response?.data?.message ||
            "Não foi possível se conectar ao servidor.",
        });
      }
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    loginMutation.mutate(values);
  };

  React.useEffect(() => {
    localStorage.removeItem("user");
  }, []);

  return {
    form,
    isPending: loginMutation.isPending,
    passwordVisibility,
    setPasswordVisibility,
    onSubmit,
    isModalOpen,
    setIsModalOpen,
  };
}
