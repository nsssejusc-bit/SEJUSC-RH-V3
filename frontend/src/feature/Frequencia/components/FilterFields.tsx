// FilterFielsd.tsx

import type React from "react";

import { listOfMonths } from "@/feature/constants";
import type { IFilterOptions } from "@/interfaces";
import { Input } from "@/shared";

type FilterFieldsProps = {
  selectedEmployee: string;
  filterOptions: IFilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<IFilterOptions>>;
};

// Função auxiliar para gerar opções de ano
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  // Gera anos de 2024 até 2026 (ou quantos anos você precisar historicamente/futuramente)
  for (let i = 2025; i <= currentYear; i++) {
    years.push(i.toString());
  }
  return years.reverse(); // Coloca o ano mais recente/futuro primeiro
};

const yearOptions = generateYearOptions();

export default function FilterFields({
  selectedEmployee,
  filterOptions,
  setFilterOptions,
}: FilterFieldsProps) {
  // Desestruture 'year' também
  const { checkbox, search, month, year } = filterOptions; 

  return (
    <>
      <div className="flex items-center gap-12 rounded bg-slate-300 px-2 py-4 *:font-medium">
         
        {/* FILTRO DE ANO - NOVO */}
        <div className="flex items-center gap-3">
          <h3 className="text-slate-800">Selecione um ano:</h3>
          <select
            name="anos"
            id="anos"
            className="rounded border-2 border-sky-900 p-1 text-slate-800 outline-none"
            value={year}
            onChange={({ currentTarget }) =>
              setFilterOptions((prevFilters) => ({
                ...prevFilters,
                year: currentTarget.value, // Atualiza o novo estado 'year'
              }))
            }
          >
            {yearOptions.map((y) => {
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>
        </div>
        {/* FIM FILTRO DE ANO */}

        {/* FILTRO DE MÊS */}
        <div className="flex items-center gap-3">
          <h3 className="text-slate-800">Selecione um mês:</h3>
          <select
            name="meses"
            id="meses"
            className="rounded border-2 border-sky-900 p-1 text-slate-800 outline-none"
            value={month}
            onChange={({ currentTarget }) =>
              setFilterOptions((prevFilters) => ({
                ...prevFilters,
                month: currentTarget.value,
              }))
            }
          >
            {listOfMonths.map((mes, index) => {
              return (
                <option key={index} value={mes}>
                  {mes}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex gap-6">
          <div>
            <label className="flex flex-row-reverse items-center gap-2 text-slate-800">
              setores
              <input
                type="radio"
                name="filterOptions"
                checked={checkbox === "setores"}
                value="setores"
                onChange={({ currentTarget }) =>
                  setFilterOptions((prevFilters) => ({
                    ...prevFilters,
                    checkbox: currentTarget.value,
                  }))
                }
              />
            </label>
          </div>

          <div>
            <label className="flex flex-row-reverse items-center gap-2 text-slate-800">
              {selectedEmployee}
              <input
                type="radio"
                name="filterOptions"
                checked={checkbox === selectedEmployee}
                value={selectedEmployee}
                onChange={({ currentTarget }) =>
                  setFilterOptions((prevFilters) => ({
                    ...prevFilters,
                    checkbox: currentTarget.value,
                  }))
                }
              />
            </label>
          </div>
        </div>
      </div>

      <Input
        id="search"
        placeholder={`Pesquise por um ${checkbox === "setores" ? "Setor" : "Funcionário"}`}
        value={search}
        onChange={({ currentTarget }) =>
          setFilterOptions((prevFilters) => ({
            ...prevFilters,
            search: currentTarget.value.toUpperCase(),
          }))
        }
      />
    </>
  );
}