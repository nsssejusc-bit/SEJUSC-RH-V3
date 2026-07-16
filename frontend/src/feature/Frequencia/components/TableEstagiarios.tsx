import { Square, SquareCheck } from "lucide-react";
import React from "react";

import type { IFilterOptions } from "@/interfaces";
import { Button } from "@/shared";

import useTableEstagiarios from "../hooks/useTableEstagiarios";

type TableProps = {
  selectedEmployee: string;
  filterOptions: IFilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<IFilterOptions>>;
};

export default function TableEstagiarios({
  selectedEmployee,
  filterOptions,
  setFilterOptions,
}: TableProps) {
  const { checkbox, search, month, year } = filterOptions;

  const {
    selectedEstagiarios,
    selectedSetoresEstagiarios,
    filterEstagiario,
    filterSetoresEstagiario,
    isLoading,
    handleToggleListOfEstagiarios,
    handleToggleListOfSetoresEstagiarios,
    convertEstagiariosToPdf,
    convertSetoresEstagiariosToPdf,
  } = useTableEstagiarios(search, month, year);

  React.useEffect(() => {
    setFilterOptions((prevFilters) => ({
      ...prevFilters,
      checkbox: "setores",
    }));
  }, [selectedEmployee, setFilterOptions]);

  return (
    <>
      <div className="overflow-x-hidden rounded shadow-md">
        <table className="w-full table-fixed text-center text-slate-700">
          {checkbox === "setores" && (
            <thead className="bg-sky-950 text-xl tracking-wider text-slate-200 uppercase">
              <tr className="*:px-2 *:py-2">
                <th scope="col">Lotação</th>
                <th scope="col">Funcionários</th>
                <th scope="col">Selecionar</th>
              </tr>
            </thead>
          )}
          {checkbox === "estagiarios" && (
            <thead className="bg-sky-950 text-xl tracking-wider text-slate-200 uppercase">
              <tr className="*:px-2 *:py-2">
                <th scope="col">Nome</th>
                <th scope="col">Lotação</th>
                <th scope="col">Selecionar</th>
              </tr>
            </thead>
          )}

          <tbody className="divide-y divide-gray-300 bg-slate-100">
            {checkbox === "setores" &&
              filterSetoresEstagiario()?.map((setor) => (
                <tr key={setor.id} className="*:px-6 *:py-4 *:text-lg">
                  <td
                    className="max-w-[120px] truncate overflow-hidden whitespace-nowrap"
                    title={setor.lotacao}
                  >
                    {setor.lotacao}
                  </td>
                  <td>{setor.quantidade}</td>
                  <td className="flex justify-center">
                    <button
                      className="cursor-pointer"
                      onClick={() =>
                        handleToggleListOfSetoresEstagiarios(setor)
                      }
                    >
                      {selectedSetoresEstagiarios.some(
                        ({ id }) => id === setor.id,
                      ) ? (
                        <SquareCheck />
                      ) : (
                        <Square />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            {checkbox === "estagiarios" &&
              filterEstagiario()?.map((estagiario) => (
                <tr key={estagiario.id} className="*:px-6 *:py-4 *:text-lg">
                  <td>{estagiario.nome}</td>
                  <td
                    className="max-w-[120px] truncate overflow-hidden whitespace-nowrap"
                    title={estagiario.secretaria_lotacao}
                  >
                    {estagiario.secretaria_lotacao}
                  </td>
                  <td className="flex justify-center">
                    <button
                      className="cursor-pointer"
                      onClick={() => handleToggleListOfEstagiarios(estagiario)}
                    >
                      {selectedEstagiarios.some(
                        ({ id }) => id === estagiario.id,
                      ) ? (
                        <SquareCheck />
                      ) : (
                        <Square />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="self-end">
        <Button
          disabled={isLoading}
          onClick={() => {
            if (checkbox === "setores") {
              convertSetoresEstagiariosToPdf();
            } else {
              convertEstagiariosToPdf();
            }
          }}
        >
          {isLoading ? "Gerando..." : "Gerar Selecionados"}
        </Button>
      </div>
    </>
  );
}
