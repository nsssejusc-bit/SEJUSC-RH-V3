// src/components/holiday-calendar/HolidayCalendar.tsx
import { useMemo, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

type Holiday = {
  id: number;
  estado: string;
  data: string; // YYYY-MM-DD
  descricao: string;
  ponto_facultativo: 0 | 1;
  tipo: "FERIADO" | "PONTO_FACULTATIVO";
};

type ApiResponse = {
  ano: number;
  mes: number;
  estado: string;
  itens: Holiday[];
};

const MESES_PT = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];
const DIAS_PT = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

const API_BASE =
  (import.meta as any).env?.VITE_API_URL?.replace(/\/$/, "") || "/api";

function pad(n: number) { return String(n).padStart(2, "0"); }
function ymd(d: Date) { return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }

function buildCalendarMatrix(year: number, month0: number) {
  // month0: 0-11
  const first = new Date(year, month0, 1);
  const startWeekDay = first.getDay(); // 0=Dom
  const daysInMonth = new Date(year, month0 + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  // prefixo em branco
  for (let i = 0; i < startWeekDay; i++) cells.push(null);
  // dias do mês
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month0, d));
  // completa até múltiplo de 7
  while (cells.length % 7 !== 0) cells.push(null);

  // fatia em semanas
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export default function HolidayCalendar({ estado = "AM" }: { estado?: string }) {
  const hoje = new Date();
  const [year, setYear] = useState(hoje.getFullYear());
  const [month0, setMonth0] = useState(hoje.getMonth()); // 0-11

  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ["feriados", year, month0 + 1, estado],
    queryFn: async () => {
      const { data } = await axios.get<ApiResponse>(
        `${API_BASE}/feriados-municipais`,
        { params: { ano: year, mes: month0 + 1, estado } }
      );
      return data;
    },
  });

  const holidaysByDate = useMemo(() => {
    const map: Record<string, Holiday[]> = {};
    (data?.itens || []).forEach((h) => {
      (map[h.data] ||= []).push(h);
    });
    return map;
  }, [data]);

  const weeks = useMemo(() => buildCalendarMatrix(year, month0), [year, month0]);

  function prevMonth() {
    const d = new Date(year, month0, 1);
    d.setMonth(d.getMonth() - 1);
    setYear(d.getFullYear());
    setMonth0(d.getMonth());
  }
  function nextMonth() {
    const d = new Date(year, month0, 1);
    d.setMonth(d.getMonth() + 1);
    setYear(d.getFullYear());
    setMonth0(d.getMonth());
  }

  return (
    <div className="w-full rounded-2xl bg-white p-3 shadow-sm border">
      <div className="mb-3 flex items-center justify-between">
        <button onClick={prevMonth} className="rounded-xl border px-3 py-1 hover:bg-gray-50">◀</button>
        <div className="text-lg font-semibold">
          {MESES_PT[month0]} {year}
        </div>
        <button onClick={nextMonth} className="rounded-xl border px-3 py-1 hover:bg-gray-50">▶</button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-600">
        {DIAS_PT.map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {weeks.flat().map((d, i) => {
          const key = d ? ymd(d) : `blank-${i}`;
          const hols = d ? holidaysByDate[ymd(d)] || [] : [];
          const isToday = d && ymd(d) === ymd(new Date());

          return (
            <div
              key={key}
              className={[
                "aspect-square rounded-xl border p-1",
                d ? "bg-white" : "bg-gray-50",
                isToday ? "ring-2 ring-blue-500 ring-offset-2" : "",
              ].join(" ")}
            >
              <div className="flex items-start justify-between">
                <span className={["text-sm", d ? "text-gray-700" : "text-gray-400"].join(" ")}>
                  {d ? d.getDate() : ""}
                </span>
                {hols.length > 0 && (
                  <span
                    title={hols.map(h => h.descricao).join(" • ")}
                    className={
                      "mt-0.5 rounded-full px-1.5 text-[10px] font-semibold " +
                      (hols.some(h => h.ponto_facultativo === 1)
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-700")
                    }
                  >
                    {hols.some(h => h.ponto_facultativo === 1) ? "PF" : "F"}
                  </span>
                )}
              </div>
              {hols.length > 0 && (
                <ul className="mt-1 space-y-0.5">
                  {hols.slice(0, 2).map((h) => (
                    <li key={h.id} className="truncate text-[10px] text-gray-700">
                      {h.descricao}
                    </li>
                  ))}
                  {hols.length > 2 && (
                    <li className="text-[10px] text-gray-500">+{hols.length - 2}</li>
                  )}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-red-200 border border-red-300" />
          <span>Feriado</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-3 w-3 rounded bg-amber-200 border border-amber-300" />
          <span>Ponto Facultativo</span>
        </div>
      </div>

      {isLoading && <div className="mt-2 text-xs text-gray-500">Carregando…</div>}
      {isError && <div className="mt-2 text-xs text-red-600">Erro ao carregar feriados.</div>}
    </div>
  );
}
