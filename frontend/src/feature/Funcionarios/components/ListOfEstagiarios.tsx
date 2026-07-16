import React from "react";

import type { IEstagiario, IServidor } from "@/interfaces";
import { Button } from "@/shared";

import useListOfEstagiarios from "../hooks/useListOfEstagiarios";

type ListOfEstagiariosProps = {
  estagiarios: IEstagiario[] | null;
  filterOptions: {
    setorSearch: string;
    setorSelect: string;
    checkbox: string;
    search: string;
  };
  setIsModalOpen: React.Dispatch<
    React.SetStateAction<{
      servidor: IServidor | null;
      estagiario: IEstagiario | null;
      modal: boolean;
      action: string | null;
    }>
  >;
};

export default function ListOfEstagiarios({
  estagiarios,
  filterOptions,
  setIsModalOpen,
}: ListOfEstagiariosProps) {
  const { checkbox } = filterOptions;
  const [isLoading, setIsLoading] = React.useState<{
    id: number | null;
    load: boolean;
    action: string | null;
  }>({
    id: null,
    load: false,
    action: null,
  });

  const { handleArchiveEstagiario, handleActiveEstagiario, filterEstagiarios } =
    useListOfEstagiarios(estagiarios, filterOptions, setIsLoading);

  return (
    <div className="grid max-h-[624px] grid-cols-3 gap-4 overflow-y-scroll rounded">
      {filterEstagiarios()?.map((estagiario) => (
        <div
          key={estagiario.id}
          className="flex flex-col justify-between gap-2.5 rounded bg-gray-100 p-3 text-slate-900"
        >
          <div>
            <h3 className="text-2xl font-medium">{estagiario.nome}</h3>
            {/* Atualizado para 'secretaria_lotacao' */}
            <p className="text-lg text-slate-700">{estagiario.secretaria_lotacao}</p>
          </div>
          <div className="flex gap-2">
            {/* --- Botões para ATIVOS --- */}
            {checkbox === "ativos" && (
              <>
                <Button
                  className="cursor-pointer rounded-full border-2 border-sky-950 px-4 py-1.5 text-sm font-bold tracking-wider text-sky-950 uppercase duration-200 ease-in hover:bg-sky-950 hover:text-sky-100"
                  onClick={() =>
                    setIsModalOpen({
                      servidor: null,
                      estagiario: estagiario,
                      modal: true,
                      action: "atualizar",
                    })
                  }
                >
                  Atualizar
                </Button>
                <Button
                  className="cursor-pointer rounded-full border-2 border-sky-950 px-4 py-1.5 text-sm font-bold tracking-wider text-sky-950 uppercase duration-200 ease-in hover:bg-sky-950 hover:text-sky-100"
                  onClick={() =>
                    setIsModalOpen({
                      servidor: null,
                      estagiario: estagiario,
                      modal: true,
                      action: "anexar",
                    })
                  }
                >
                  Anexos
                </Button>
                <Button
                  className="cursor-pointer rounded-full border-2 border-sky-950 px-4 py-1.5 text-sm font-bold tracking-wider text-sky-950 uppercase duration-200 ease-in hover:bg-sky-950 hover:text-sky-100"
                  onClick={() => handleArchiveEstagiario(estagiario.id!)}
                >
                  {isLoading.load && isLoading.id === estagiario.id && isLoading.action === "arquivar" ? "Inativando" : "Inativar"}
                </Button>
              </>
            )}

            {/* --- Botão para INATIVOS --- */}
            {checkbox === "inativos" && (
              <Button
                className="cursor-pointer rounded-full border-2 border-sky-950 px-4 py-1.5 text-sm font-bold tracking-wider text-sky-950 uppercase duration-200 ease-in hover:bg-sky-950 hover:text-sky-100"
                onClick={() => handleActiveEstagiario(estagiario.id!)}
              >
                {isLoading.load && isLoading.id === estagiario.id && isLoading.action === "desarquivar" ? "Ativando" : "Ativar"}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}