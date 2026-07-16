import { Square, SquareCheck } from "lucide-react";
import React from "react";

import type { IFilterOptions } from "@/interfaces";
import { Button } from "@/shared";

import useTableServidores from "../hooks/useTableServidores";

type TableProps = {
  selectedEmployee: string;
  filterOptions: IFilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<IFilterOptions>>;
};

export default function TableServidores({
  selectedEmployee,
  filterOptions,
  setFilterOptions,
}: TableProps) {
  const { checkbox, search, month, year } = filterOptions;

  const {
    selectedServidores,
    selectedSetoresServidores,
    isLoading,
    filterServidores,
    filterSetoresServidor,
    convertSetoresServidorToPdf,
    convertServidoresToPdf,
    handleToggleListOfSetoresServidores,
    handleToggleListOfServidores,
  } = useTableServidores(search, month, year);

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
          {checkbox === "servidores" && (
            <thead className="bg-sky-950 text-xl tracking-wider text-slate-200 uppercase">
              <tr className="*:px-2 *:py-2">
                <th scope="col">Nome</th>
                <th scope="col">Cargo</th>
                <th scope="col">Lotação</th>
                <th scope="col">Selecionar</th>
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-gray-300 bg-slate-100">
            {checkbox === "setores" &&
              filterSetoresServidor()?.map((setor) => (
                <tr key={setor.id} className="*:px-6 *:py-4 *:text-lg">
                  <td
                    className="max-w-[120px] truncate overflow-hidden whitespace-nowrap"
                    title={setor.setor}
                  >
                    {setor.setor}
                  </td>
                  <td>{setor.quantidade}</td>
                  <td className="flex justify-center">
                    <button
                      className="cursor-pointer"
                      onClick={() => handleToggleListOfSetoresServidores(setor)}
                    >
                      {selectedSetoresServidores.some(
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
            {checkbox === "servidores" &&
              filterServidores()?.map((servidor) => (
                <tr key={servidor.id} className="*:px-6 *:py-4 *:text-lg">
                  <td>{servidor.nome}</td>
                  <td>{servidor.cargo}</td>
                  <td
                    className="max-w-[120px] truncate overflow-hidden whitespace-nowrap"
                    title={servidor.secretaria_lotacao}
                  >
                    {servidor.secretaria_lotacao}
                  </td>
                  <td className="flex justify-center">
                    <button
                      className="cursor-pointer"
                      onClick={() => handleToggleListOfServidores(servidor)}
                    >
                      {selectedServidores.some(
                        ({ id }) => id === servidor.id,
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
              convertSetoresServidorToPdf();
            } else {
              convertServidoresToPdf();
            }
          }}
        >
          {isLoading ? "Gerando..." : "Gerar Selecionados"}
        </Button>
      </div>
    </>
  );
}
