import { queryOptions } from "@tanstack/react-query";

import { api } from "@/api";

import type { ISetorEstagiario } from "../interfaces";

export default function buscarSetoresEstagiariosQueryOptions() {
  return queryOptions({
    queryKey: ["setor_estagiarios"],
    queryFn: buscarSetores,
    staleTime: 60000,
  });
}

const buscarSetores = async (): Promise<ISetorEstagiario[] | null> => {
  const response = await api.get("/setor/estagiarios");
  return response.data.setores;
};
