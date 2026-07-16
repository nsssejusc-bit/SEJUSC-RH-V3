import { Input } from "@/shared";

type filterOptionsProps = {
  filterOptions: { checkbox: string; search: string };
  setFilterOptions: React.Dispatch<
    React.SetStateAction<{ checkbox: string; search: string }>
  >;
};

export default function FilterFields({
  filterOptions,
  setFilterOptions,
}: filterOptionsProps) {
  const { checkbox, search } = filterOptions;

  return (
    <>
      <div className="flex items-center gap-12 rounded bg-slate-300 px-2 py-4 *:font-medium">
        <div className="flex gap-6">
          <div>
            <label className="flex flex-row-reverse items-center gap-2 text-slate-800">
              Inativados
              <input
                type="radio"
                name="filterOptions"
                checked={checkbox === "Arquivar"}
                value="Arquivar" // Valor que corresponde ao banco de dados
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
              Reativados
              <input
                type="radio"
                name="filterOptions"
                checked={checkbox === "Desarquivar"}
                value="Desarquivar" // Valor que corresponde ao banco de dados
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
              Cadastrados
              <input
                type="radio"
                name="filterOptions"
                checked={checkbox === "Cadastrar"}
                value="Cadastrar"
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
              Atualizados
              <input
                type="radio"
                name="filterOptions"
                checked={checkbox === "Atualizar"}
                value="Atualizar"
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
        placeholder="Pesquise por um Nome"
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

