import { queryOptions } from "@tanstack/react-query";

import { api } from "@/api";

import type { IServidor } from "../feature/Frequencia/interfaces";

export default function buscarServidoresQueryOptions() {
  return queryOptions({
    queryKey: ["servidores"],
    queryFn: buscarServidores,
    staleTime: 60000,
  });
}

const buscarServidores = async (): Promise<IServidor[] | null> => {
  const response = await api.get("/servidores");
  return response.data.servidores;
};
