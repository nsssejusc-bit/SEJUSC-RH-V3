// src/pages/Feriados/FeriadosPage.tsx
import FormCreateFeriado from "../feature/Feriados/components/FormCreateFeriado";
import HolidayCalendar from "../components/holiday-calendar/HolidayCalendar";

export default function FeriadosPage() {
  return (
    // container da página
    <main className="flex flex-col gap-5 overflow-y-auto py-5 pr-2">{/* pr menor */}
  <h1 className="pb-6 text-4xl font-semibold text-sky-950">
    Cadastrar Feriado/Ponto Facultativo
  </h1>

  {/* Form e Calendário LADO A LADO, coladinhos */}
  <div className="xl:flex xl:flex-row xl:items-start xl:gap-1"> {/* gap-1 ~ 4px */}
    {/* Coluna do formulário (largura fixa) */}
    <div className="xl:w-[560px] shrink-0">
      <FormCreateFeriado />
    </div>

    {/* Coluna do calendário (encostado no form) */}
    <div className="sticky top-6 self-start w-full xl:w-[550px]">
      <HolidayCalendar estado="AM" />
    </div>
  </div>
</main>

  );
}
