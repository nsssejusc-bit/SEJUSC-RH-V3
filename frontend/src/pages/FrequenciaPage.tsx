import React from "react";

import { listOfMonths } from "@/feature/constants";
import FilterFields from "@/feature/Frequencia/components/FilterFields";
import TableEstagiarios from "@/feature/Frequencia/components/TableEstagiarios";
import TableServidores from "@/feature/Frequencia/components/TableServidores";
import type { IFilterOptions } from "@/interfaces";
import Header from "@/shared/Header";

export default function FrequenciaPage() {
  const data = new Date();
  const actualMonth = data.getMonth();

  const [selectedEmployee, setSelectedEmployee] = React.useState("servidores");
  const [filterOptions, setFilterOptions] = React.useState<IFilterOptions>({
    checkbox: "setores",
    search: "",
    month: listOfMonths[actualMonth],
    year: data.getFullYear().toString(),
  });

  return (
    <main className="flex max-h-[842px] flex-col gap-5 py-5 pr-10">
      <Header
        label="Gerador de Frequência"
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
      />

      <FilterFields
        selectedEmployee={selectedEmployee}
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
      />

      {selectedEmployee === "servidores" ? (
        <TableServidores
          selectedEmployee={selectedEmployee}
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
        />
      ) : (
        <TableEstagiarios
          selectedEmployee={selectedEmployee}
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
        />
      )}
    </main>
  );
}
