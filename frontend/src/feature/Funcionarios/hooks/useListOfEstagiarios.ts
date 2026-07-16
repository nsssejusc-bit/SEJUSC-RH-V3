import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/api";
import type { IEstagiario, User } from "@/interfaces";


export default function useListOfEstagiarios(
  estagiarios: IEstagiario[] | null,
  filterOptions: {
    setorSearch: string;
    setorSelect: string;
    checkbox: string;
    search: string;
  },
  setIsLoading: React.Dispatch<
    React.SetStateAction<{
      id: number | null;
      load: boolean;
      action: string | null;
    }>
  >,
) {
  const queryClient = useQueryClient();
  const storedUser = JSON.parse(localStorage.getItem("user")!) as User;
  const { setorSearch, setorSelect, search } = filterOptions;

  const filterEstagiarios = (): IEstagiario[] | undefined => {
    if (estagiarios) {
      let filteredListOfEstagiarios = estagiarios;

      if (search) {
        filteredListOfEstagiarios = filteredListOfEstagiarios?.filter(
          (estagiario) => {
            return estagiario.nome.includes(search);
          },
        );
      }

      if (setorSelect) {
        filteredListOfEstagiarios = filteredListOfEstagiarios?.filter(
          (estagiario) => {
            // Atualizado para 'secretaria_lotacao'
            return estagiario.secretaria_lotacao === setorSelect;
          },
        );
      }

      if (setorSearch) {
        filteredListOfEstagiarios = filteredListOfEstagiarios?.filter(
          (estagiario) => {
            // Atualizado para 'secretaria_lotacao'
            return estagiario.secretaria_lotacao.includes(setorSearch);
          },
        );
      }
      return filteredListOfEstagiarios;
    }
  };

  const historyLogsArchive = async (
    user: string,
    nome: string,
    setor: string,
  ) => {
    try {
      await api.post("/historico-logs", {
        mensagem: `O usuário de nome ${user} inativou o estagiário ${nome} do setor ${setor}`,
        nome: nome,
        acao: "Inativar",
      });
    } catch (error) {
      console.log("Erro ao criar o log", error);
    }
  };

  const handleArchiveEstagiario = async (id: number) => {
    try {
      setIsLoading({ id: id, load: true, action: "arquivar" });

      const response = await api.patch(`/estagiarios/${id}/arquivar`);
      const { estagiario_arquivado } = (await response.data) as {
        mensagem: string;
        estagiario_arquivado: { nome: string; setor: string; secretaria_lotacao?: string };
      };

      await historyLogsArchive(
        storedUser.nome,
        estagiario_arquivado.nome,
        estagiario_arquivado.secretaria_lotacao || estagiario_arquivado.setor, // Usa o novo nome
      );

      queryClient.invalidateQueries({ queryKey: ['estagiarios'] });
      queryClient.invalidateQueries({ queryKey: ['estagiarios_arquivados'] });
      toast.success("Estagiário inativado com sucesso");
    } catch (error) {
      console.error("Error ao inativar estagiário", error);
      toast.error("Não foi possível inativar o estagiário");
    } finally {
      setIsLoading({ id: null, load: false, action: null });
    }
  };

  const historyLogsUnarchive = async (
    user: string,
    nome: string,
    setor: string,
  ) => {
    try {
      await api.post("/historico-logs", {
        mensagem: `O usuário de nome ${user} reativou o estagiário ${nome} do setor ${setor}`,
        nome: nome,
        acao: "Ativar",
      });
    } catch (error) {
      console.log("Erro ao criar o log", error);
    }
  };

  const handleActiveEstagiario = async (id: number) => {
    try {
      setIsLoading({ id: id, load: true, action: "desarquivar" });

      const response = await api.patch(`/estagiarios/${id}/atualizar-status`);
      const { estagiario_ativado } = response.data as {
        mensagem: string;
        estagiario_ativado: { nome: string; setor: string; secretaria_lotacao?: string };
      };

      await historyLogsUnarchive(
        storedUser.nome,
        estagiario_ativado.nome,
        estagiario_ativado.secretaria_lotacao || estagiario_ativado.setor, // Usa o novo nome
      );

      queryClient.invalidateQueries({ queryKey: ['estagiarios'] });
      queryClient.invalidateQueries({ queryKey: ['estagiarios_arquivados'] });
      toast.success("Estagiário reativado com sucesso");
    } catch (error) {
      console.error("Error ao reativar estagiário", error);
      toast.error("Não foi possível reativar o estagiário");
    } finally {
      setIsLoading({ id: null, load: false, action: null });
    }
  };

  return {
    handleArchiveEstagiario,
    handleActiveEstagiario,
    filterEstagiarios,
  };
}