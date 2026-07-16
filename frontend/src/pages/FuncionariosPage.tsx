import { useQueries } from "@tanstack/react-query";
import React from "react";

import FilterFields from "@/feature/Funcionarios/components/FilterFields";
import FormAnexarEstagiario from "@/feature/Funcionarios/components/FormAnexarEstagiario";
import FormAnexarServidor from "@/feature/Funcionarios/components/FormAnexarServidor";
import FormCreateEstagiario from "@/feature/Funcionarios/components/FormCreateEstagiario";
import FormCreateServidor from "@/feature/Funcionarios/components/FormCreateServidor";
import FormUpdateEstagiario from "@/feature/Funcionarios/components/FormUpdateEstagiario";
import FormUpdateServidor from "@/feature/Funcionarios/components/FormUpdateServidor";
import ListOfEstagiarios from "@/feature/Funcionarios/components/ListOfEstagiarios";
import ListOfServidores from "@/feature/Funcionarios/components/ListOfServidores";
import buscarEstagiariosArquivadorsQueryOptions from "@/feature/Funcionarios/queries/buscarEstagiariosArquivados";
import buscarServidoresArquivadosQueryOptions from "@/feature/Funcionarios/queries/buscarServidoresArquivados";
import type { IEstagiario, IServidor } from "@/interfaces";
import buscarEstagiariosQueryOptions from "@/queries/buscarEstagiariosQueryOptions";
import buscarServidoresQueryOptions from "@/queries/buscarServidoresQueryOptions";
import Button from "@/shared/Button";
import Header from "@/shared/Header";

export default function FuncionariosPage() {
  const [selectedEmployee, setSelectedEmployee] = React.useState("servidores");
  const [isModalOpen, setIsModalOpen] = React.useState<{
    servidor: IServidor | null;
    estagiario: IEstagiario | null;
    modal: boolean;
    action: string | null;
  }>({
    servidor: null,
    estagiario: null,
    modal: false,
    action: null,
  });
  const [filterOptions, setFilterOptions] = React.useState({
    setorSearch: "",
    setorSelect: "",
    checkbox: "ativos",
    search: "",
  });
  const { checkbox } = filterOptions;
  const [
    servidoresQuery,
    servidoresArquivadosQuery,
    estagiariosQuery,
    estagiariosArquivadosQuery,
  ] = useQueries({
    queries: [
      buscarServidoresQueryOptions(),
      buscarServidoresArquivadosQueryOptions(),
      buscarEstagiariosQueryOptions(),
      buscarEstagiariosArquivadorsQueryOptions(),
    ],
  });

  const activeServidores = servidoresQuery.data as IServidor[] | null;
  const archivedServidores = servidoresArquivadosQuery.data as
    | IServidor[]
    | null;
  const activeEstagiarios = estagiariosQuery.data as IEstagiario[] | null;
  const archivedEstagiarios = estagiariosArquivadosQuery.data as
    | IEstagiario[]
    | null;

  return (
    <main className="flex flex-col gap-5 overflow-scroll py-5 pr-10">
      {isModalOpen.modal ? (
        <>
          {/* Servidores */}
          {selectedEmployee === "servidores" && (
            <>
              {isModalOpen.action === "atualizar" && (
                <FormUpdateServidor
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                />
              )}
              {isModalOpen.action === "anexar" && (
                <FormAnexarServidor
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                />
              )}
              {isModalOpen.action === "visualizar" && (
                // Use o mesmo componente!
                <FormAnexarServidor 
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                />
              )}
              {isModalOpen.action === "criar" && (
                <FormCreateServidor setIsModalOpen={setIsModalOpen} />
              )}
            </>
          )}

          {/* Estagiários */}
          {selectedEmployee === "estagiarios" && (
            <>
              {isModalOpen.action === "atualizar" && (
                <FormUpdateEstagiario
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                />
              )}
              {/* ... */}
              {isModalOpen.action === "anexar" && (
                <FormAnexarEstagiario
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                />
              )}
              {isModalOpen.action === "visualizar" && (
                // Use o mesmo componente!
                <FormAnexarEstagiario 
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                />
              )}
              {isModalOpen.action === "criar" && (
                <FormCreateEstagiario setIsModalOpen={setIsModalOpen} />
              )}
            </>
          )}
        </>
      ) : (
        <>
          <div className="flex justify-between">
            <Header
              label="Lista de Funcionários"
              selectedEmployee={selectedEmployee}
              setSelectedEmployee={setSelectedEmployee}
            />
            <div className="self-center">
              <Button
                onClick={() =>
                  setIsModalOpen({
                    servidor: null,
                    estagiario: null,
                    modal: true,
                    action: "criar",
                  })
                }
              >
                {selectedEmployee === "servidores"
                  ? "CADASTRAR SERVIDOR"
                  : "CADASTRAR ESTAGIÁRIO"}
              </Button>
            </div>
          </div>
          <FilterFields
            selectedEmployee={selectedEmployee}
            filterOptions={filterOptions}
            setFilterOptions={setFilterOptions}
          />

          {selectedEmployee === "servidores" ? (
            <ListOfServidores
              servidores={
                checkbox === "ativos" ? activeServidores : archivedServidores
              }
              filterOptions={filterOptions}
              setIsModalOpen={setIsModalOpen}
            />
          ) : (
            <ListOfEstagiarios
              estagiarios={
                checkbox === "ativos" ? activeEstagiarios : archivedEstagiarios
              }
              filterOptions={filterOptions}
              setIsModalOpen={setIsModalOpen}
            />
          )}
        </>
      )}
    </main>
  );
}