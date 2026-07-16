import { queryOptions } from "@tanstack/react-query";

import { api } from "@/api";
import type { IServidor } from "@/interfaces";

export default function buscarServidoresArquivadosQueryOptions() {
  return queryOptions({
    queryKey: ["servidores_arquivados"],
    queryFn: buscarServidores,
    staleTime: 60000,
  });
}

const buscarServidores = async (): Promise<IServidor[] | null> => {
  const response = await api.get("/servidores/arquivados");
  return response.data["servidores"];
};
