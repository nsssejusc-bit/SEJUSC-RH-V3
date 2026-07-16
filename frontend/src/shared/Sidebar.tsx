import {
  CalendarPlus,
  ChartPie,
  Folder,
  History,
  LogOut,
  PanelRightOpen,
  RefreshCw,
  UserRound,
} from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

import Logo from "@/assets/logo.png";
import useAuth from "@/context/useAuth";
import type { User } from "@/interfaces";

type SidebarProps = React.ComponentProps<"aside"> & {
  handleOpenSideBar: () => void;
  isSideBarOpen: boolean;
};

export default function Sidebar({
  handleOpenSideBar,
  isSideBarOpen,
}: SidebarProps) {
  const { logout } = useAuth();
  const storedUser = JSON.parse(localStorage.getItem("user")!) as User;
  const location = useLocation();
  const path =
    location.pathname === "/frequencia" ||
    location.pathname === "/historico" ||
    location.pathname === "/dashboard";

  return (
    <aside
      className={`relative flex flex-col rounded-r-lg bg-sky-950 p-4 shadow-2xl ${
        isSideBarOpen ? "" : "max-w-max"
      }`}
    >
      {path && (
        <img
          className={`absolute bottom-0 ${isSideBarOpen ? "left-72" : "left-24"} `}
          height={94}
          width={94}
          src={Logo}
          alt="sejusc-rh"
        />
      )}

      <button
        onClick={handleOpenSideBar}
        className="group flex cursor-pointer bg-sky-950 p-2 text-xl"
      >
        <PanelRightOpen
          size={32}
          className={`text-slate-200 transition-all group-hover:text-slate-400 ${
            isSideBarOpen ? "" : "rotate-180 duration-200"
          } duration-200`}
        />
      </button>

      <div className="group flex flex-grow items-center gap-4 p-2 text-slate-200">
        {isSideBarOpen ? (
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white p-1.5 text-sky-950">
              <UserRound size={24} />
            </span>
            <div className="flex max-h-10 flex-col justify-center">
              <span className="text-md font-semibold">{`${storedUser.nome.split(" ")[0]} ${
                storedUser.nome.split(" ")[1]
              }`}</span>
              <span className="text-md font-medium">
                {storedUser.cargo.toUpperCase()}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 py-2.5">
            <span className="rounded-full bg-white p-1.5 text-sky-950">
              <UserRound size={24} />
            </span>
          </div>
        )}
      </div>

      {/* A classe 'flex-grow-[2]' foi ajustada para um melhor controlo do espaço */}
      <div className="flex-grow-[6]">
        <div className="mt-10 flex flex-col gap-6">
          <Link
            to={"/dashboard"}
            className="group flex items-center gap-4 p-2 text-2xl text-slate-200 transition-colors duration-200 hover:text-slate-400"
          >
            <ChartPie
              size={32}
              className="text-slate-200 transition-colors group-hover:text-slate-400"
            />
            {isSideBarOpen && "Dashboard"}
          </Link>

          <Link
            to={"/frequencia"}
            className="group flex items-center gap-4 p-2 text-2xl text-slate-200 transition-colors duration-200 hover:text-slate-400"
          >
            <RefreshCw
              size={32}
              className="text-slate-200 transition-colors group-hover:text-slate-400"
            />
            {isSideBarOpen && "Frequência"}
          </Link>

          <Link
            to={"/funcionarios"}
            className="group flex items-center gap-4 p-2 text-2xl text-slate-200 transition-colors duration-200 hover:text-slate-400"
          >
            <Folder
              size={32}
              className="text-slate-200 transition-colors group-hover:text-slate-400"
            />
            {isSideBarOpen && "Funcionários"}
          </Link>

          <Link
            to={"/feriados"}
            className="group flex items-center gap-4 p-2 text-2xl text-slate-200 transition-colors duration-200 hover:text-slate-400"
          >
            <CalendarPlus
              size={32}
              className="text-slate-200 transition-colors group-hover:text-slate-400"
            />
            {isSideBarOpen && "Feriados"}
          </Link>
          
          <Link
            to={"/historico"}
            className="group flex items-center gap-4 p-2 text-2xl text-slate-200 transition-colors duration-200 hover:text-slate-400"
          >
            <History
              size={32}
              className="text-slate-200 transition-colors group-hover:text-slate-400"
            />
            {isSideBarOpen && "Histórico"}
          </Link>

        </div>
      </div>

      <button
        onClick={() => logout()}
        className="group flex cursor-pointer bg-sky-950 p-2 text-xl"
      >
        {isSideBarOpen ? (
          <div className="flex items-center gap-4">
            <LogOut
              size={32}
              className="text-slate-200 transition-colors duration-100 group-hover:text-slate-400"
            />
            <span className="text-xl text-slate-200">Sair da conta</span>
          </div>
        ) : (
          <LogOut
            size={32}
            className="text-slate-200 transition-colors duration-100 group-hover:text-slate-400"
          />
        )}
      </button>
    </aside>
  );
}

