import type React from "react";

type HeaderProps = {
  label: string;
  selectedEmployee: string;
  setSelectedEmployee: React.Dispatch<React.SetStateAction<string>>;
};

export default function Header({
  label,
  selectedEmployee,
  setSelectedEmployee,
}: HeaderProps) {
  return (
    <header>
      <h1 className="pb-8 text-4xl font-semibold text-sky-950">{label}</h1>
      <div className="flex gap-5">
        <div>
          <label
            className={`relative cursor-pointer rounded px-3 py-2 text-lg font-medium tracking-wider ${selectedEmployee === "servidores" ? "bg-sky-950 text-slate-200" : "text-sky-950"} duration-100 ease-in`}
          >
            Servidores
            <input
              type="radio"
              name="servidores"
              className="absolute opacity-0"
              checked={selectedEmployee === "servidores"}
              value="servidores"
              onChange={({ currentTarget }) =>
                setSelectedEmployee(currentTarget.value)
              }
            />
          </label>
        </div>
        <div>
          <label
            className={`relative cursor-pointer rounded px-3 py-2 text-lg font-medium tracking-wider ${selectedEmployee === "estagiarios" ? "bg-sky-950 text-slate-200" : "text-sky-950"} duration-100 ease-in`}
          >
            Estagiários
            <input
              type="radio"
              name="estagiarios"
              className="absolute opacity-0"
              checked={selectedEmployee === "estagiarios"}
              value="estagiarios"
              onChange={({ currentTarget }) =>
                setSelectedEmployee(currentTarget.value)
              }
            />
          </label>
        </div>
      </div>
    </header>
  );
}
