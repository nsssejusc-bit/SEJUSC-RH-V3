import React from "react";

import FilterFields from "@/feature/Historico/components/FilterFields";
import ListOfLogs from "@/feature/Historico/components/ListOfLogs";

export default function AlteracoesPage() {
  const [filterOptions, setFilterOptions] = React.useState({
    checkbox: "Arquivar",
    search: "",
  });

  return (
    <main className="flex max-h-[824px] flex-col gap-5 py-5 pr-10">
      <h1 className="pb-8 text-4xl font-semibold text-sky-950">
        Histórico de Alterações
      </h1>
      <FilterFields
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
      />
      <ListOfLogs filterOptions={filterOptions} />
    </main>
  );
}
