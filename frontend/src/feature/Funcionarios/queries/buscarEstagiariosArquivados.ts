import { queryOptions } from "@tanstack/react-query";

import { api } from "@/api";
import type { IServidor } from "@/interfaces";

export default function buscarEstagiariosArquivadorsQueryOptions() {
  return queryOptions({
    queryKey: ["estagiarios_arquivados"],
    queryFn: buscarEstagiarios,
    staleTime: 60000,
  });
}

const buscarEstagiarios = async (): Promise<IServidor[] | null> => {
  const response = await api.get("/estagiarios/arquivados");
  return response.data["estagiarios"];
};
