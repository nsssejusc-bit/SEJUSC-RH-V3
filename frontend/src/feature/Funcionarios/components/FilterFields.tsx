import { listOfSetores } from "@/feature/constants";
import Input from "@/shared/Input";

type filterOptionsProps = {
  selectedEmployee: string;
  filterOptions: {
    setorSearch: string;
    setorSelect: string;
    checkbox: string;
    search: string;
  };
  setFilterOptions: React.Dispatch<
    React.SetStateAction<{
      setorSearch: string;
      setorSelect: string;
      checkbox: string;
      search: string;
    }>
  >;
};

export default function FilterFields({
  selectedEmployee,
  filterOptions,
  setFilterOptions,
}: filterOptionsProps) {
  const { setorSearch, checkbox, search } = filterOptions;

  return (
    <>
      <div className="flex items-center gap-12 rounded bg-slate-300 px-2 py-4 *:font-medium">
        <div className="flex items-center gap-3">
          <h3 className="text-slate-800">Selecione um setor:</h3>
          <select
            name="meses"
            id="meses"
            className="rounded border-2 border-sky-900 p-1 text-slate-800 outline-none"
            onChange={({ currentTarget }) =>
              setFilterOptions((prevFilters) => ({
                ...prevFilters,
                setorSelect: currentTarget.value,
              }))
            }
          >
            <option value=""></option>;
            {listOfSetores.map((setor, index) => {
              return (
                <option key={index} value={setor}>
                  {setor}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex gap-6">
          <div>
            <label className="flex flex-row-reverse items-center gap-2 text-slate-800">
              Ativos
              <input
                type="radio"
                name="filterOptions"
                checked={checkbox === "ativos"}
                value="ativos"
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
              Inativos
              <input
                type="radio"
                name="filterOptions"
                checked={checkbox === "inativos"}
                value="inativos"
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
      <div className="flex gap-4">
        <div className="grow">
          <Input
            id="search"
            placeholder={`Pesquise por um ${
              selectedEmployee === "servidores" ? "Servidor" : "Estagiário"
            }`}
            value={search}
            onChange={({ currentTarget }) =>
              setFilterOptions((prevFilters) => ({
                ...prevFilters,
                search: currentTarget.value.toUpperCase(),
              }))
            }
          />
        </div>
        <div className="grow">
          <Input
            id="setorSearch"
            placeholder="Pesquise por um Setor"
            value={setorSearch}
            onChange={({ currentTarget }) =>
              setFilterOptions((prevFilters) => ({
                ...prevFilters,
                setorSearch: currentTarget.value.toUpperCase(),
              }))
            }
          />
        </div>
      </div>
    </>
  );
}