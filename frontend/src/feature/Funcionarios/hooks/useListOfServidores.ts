import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/api";
import type { IServidor, User } from "@/interfaces";
import buscarServidoresQueryOptions from "@/queries/buscarServidoresQueryOptions";

import buscarServidoresArquivadosQueryOptions from "../queries/buscarServidoresArquivados";

export default function useListOfServidores(
  servidores: IServidor[] | null,
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

  const filterServidores = (): IServidor[] | undefined => {
    if (servidores) {
      let filteredListOfServidores = servidores;

      if (search) {
        filteredListOfServidores = filteredListOfServidores?.filter(
          (servidor) => {
            return servidor.nome.includes(search);
          },
        );
      }

      if (setorSelect) {
        filteredListOfServidores = filteredListOfServidores?.filter(
          (servidor) => {
            // Atualizado para 'secretaria_lotacao'
            return servidor.secretaria_lotacao === setorSelect;
          },
        );
      }

      if (setorSearch) {
        filteredListOfServidores = filteredListOfServidores?.filter(
          (servidor) => {
            // Atualizado para 'secretaria_lotacao'
            return servidor.secretaria_lotacao.includes(setorSearch);
          },
        );
      }
      return filteredListOfServidores;
    }
  };

  const historyLogsArchive = async (
    user: string,
    nome: string,
    setor: string,
  ) => {
    try {
      await api.post("/historico-logs", {
        mensagem: `O usuário de nome ${user} inativou o servidor ${nome} do setor ${setor}`,
        nome: nome,
        acao: "Inativar",
      });
    } catch (error) {
      console.log("Erro ao criar o log", error);
    }
  };

  const handleArchiveServidor = async (id: number) => {
    try {
      setIsLoading({ id: id, load: true, action: "arquivar" });

      const response = await api.patch(`/servidores/${id}/arquivar`);
      const { servidor_arquivado } = (await response.data) as {
        mensagem: string;
        // O backend ainda pode retornar 'setor', mas usaremos 'secretaria_lotacao' se disponível
        servidor_arquivado: { nome: string; setor: string; secretaria_lotacao?: string };
      };

      await historyLogsArchive(
        storedUser.nome,
        servidor_arquivado.nome,
        servidor_arquivado.secretaria_lotacao || servidor_arquivado.setor, // Usa o novo nome
      );

      queryClient.invalidateQueries(buscarServidoresQueryOptions());
      queryClient.invalidateQueries(buscarServidoresArquivadosQueryOptions());
      toast.success("Servidor inativado com sucesso");
    } catch (error) {
      console.error("Error ao inativar servidor", error);
      toast.error("Não foi possível inativar o servidor");
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
        mensagem: `O usuário de nome ${user} reativou o servidor ${nome} do setor ${setor}`,
        nome: nome,
        acao: "Ativar",
      });
    } catch (error) {
      console.log("Erro ao criar o log", error);
    }
  };

  const handleActiveServidor = async (id: number) => {
    try {
      setIsLoading({ id: id, load: true, action: "desarquivar" });

      const response = await api.patch(`/servidores/${id}/atualizar-status`);
      const { servidor_ativado } = response.data as {
        mensagem: string;
        servidor_ativado: { nome: string; setor: string; secretaria_lotacao?: string };
      };

      await historyLogsUnarchive(
        storedUser.nome,
        servidor_ativado.nome,
        servidor_ativado.secretaria_lotacao || servidor_ativado.setor, // Usa o novo nome
      );

      queryClient.invalidateQueries(buscarServidoresQueryOptions());
      queryClient.invalidateQueries(buscarServidoresArquivadosQueryOptions());
      toast.success("Servidor reativado com sucesso");
    } catch (error) {
      console.error("Error ao reativar servidor", error);
      toast.error("Não foi possível reativar o servidor");
    } finally {
      setIsLoading({ id: null, load: false, action: null });
    }
  };

  const downloadFichaFuncional = async (documento_id: number) => {
    try {
      const response = await api.get(
        `/fichas-funcionais/download/${documento_id}`,
        {
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers["content-disposition"];
      let fileName = "ficha-funcional.pdf";

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch?.[1]) {
          fileName = fileNameMatch[1];
        }
      }

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Erro ao baixar o arquivo:", error);
    }
  };

  const generateFichaFuncional = async (id: number) => {
    try {
      setIsLoading({ id: id, load: true, action: "ficha" });

      const response = await api.post(`servidores/${id}/gerar-ficha-funcional`);
      const { documento_id } = response.data;

      await downloadFichaFuncional(documento_id);
      setIsLoading({ id: null, load: false, action: null });
    } catch (error) {
      console.log("Erro ao gerar ficha funcional", error);
      toast.error("Não foi possível gerar a ficha funcional");
    }
  };

  return {
    handleActiveServidor,
    handleArchiveServidor,
    generateFichaFuncional,
    filterServidores,
  };
}