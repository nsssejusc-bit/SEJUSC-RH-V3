import { queryOptions } from "@tanstack/react-query";

import { api } from "@/api";

import type { IEstagiario } from "../feature/Frequencia/interfaces";

export default function buscarEstagiariosQueryOptions() {
  return queryOptions({
    queryKey: ["estagiarios"],
    queryFn: buscarEstagiarios,
    staleTime: 60000,
  });
}

const buscarEstagiarios = async (): Promise<IEstagiario[] | null> => {
  const response = await api.get("/estagiarios");
  return response.data.estagiarios;
};
