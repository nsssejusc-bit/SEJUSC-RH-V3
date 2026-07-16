import { queryOptions } from "@tanstack/react-query";

import { api } from "@/api";

import type { ISetorServidor } from "../interfaces";

export default function buscarSetoresServidoresQueryOptions() {
  return queryOptions({
    queryKey: ["buscar_setor"],
    queryFn: buscarSetores,
    staleTime: 60000,
  });
}

const buscarSetores = async (): Promise<ISetorServidor[] | null> => {
  const response = await api.get("/buscar_setor");
  return response.data.setores;
};
