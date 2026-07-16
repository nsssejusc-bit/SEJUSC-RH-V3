import { useQueries } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

import { api } from "@/api";
import buscarServidoresQueryOptions from "@/queries/buscarServidoresQueryOptions";

import type { IServidor, ISetorServidor } from "../interfaces";
import buscarSetoresServidoresQueryOptions from "../queries/buscarSetoresServidoresQueryOptions";

// CERTIFIQUE-SE QUE O 'year' ESTÁ AQUI NA ASSINATURA
export default function useTableServidores(search: string, month: string, year: string) {
  const [selectedSetoresServidores, setSelectedSetoresServidores] =
    React.useState<ISetorServidor[]>([]);
  const [selectedServidores, setSelectedServidores] = React.useState<
    IServidor[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [setoresQuery, servidoresQuery] = useQueries({
    queries: [
      buscarSetoresServidoresQueryOptions(),
      buscarServidoresQueryOptions(),
    ],
  });

  const setores = setoresQuery.data;
  const servidores = servidoresQuery.data;

  const downloadMultiSetoresServidorZip = async (month: string) => {
    try {
      await api
        .get(`/setores/pdf/download-zip-multissetores/${month}`, {
          responseType: "blob",
        })
        .then((response) => {
          const blob = new Blob([response.data], { type: "application/zip" });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `frequencias_multissetores_${month}.zip`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error("Erro ao baixar o arquivo ZIP multissetores:", error);
        });
    } catch (error) {
      console.log("Erro ao baixar ZIP multissetores:", error);
    }
  };

  const downloadSetorServidorZip = async (setor: string, month: string) => {
    try {
      await api
        .get(
          `/setores/pdf/download-zip/${setor.replace(/\//g, "_")}/${month}`,
          { responseType: "blob" },
        )
        .then((response) => {
          const blob = new Blob([response.data], { type: "application/zip" });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `frequencia_mensal_${setor.replace(/\//g, "_")}_${month}.zip`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.log("Erro ao baixar o arquivo ZIP:", error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const downloadMultiServidoresZip = async () => {
    try {
      const response = await api.get(`/servidores/pdf/download-zip/${month}`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `frequencia_mensal_${month}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log("Erro ao baixar arquivo zip: ", error);
    }
  };

    const convertSetoresServidorToPdf = async () => {
    if (selectedSetoresServidores.length === 0) {
      toast.error("Nenhum servidor foi selecionado");
      return;
    }

    const selectedSetoresFormatted = selectedSetoresServidores.map(
      ({ setor }) => {
        return setor.toLowerCase();
      },
    );

    try {
      setIsLoading(true);
      // VERIFIQUE SE O 'ano: year' ESTÁ SENDO ENVIADO AQUI
      await api.post(`/setores/pdf`, {
        setores: selectedSetoresFormatted,
        mes: month,
        ano: year, 
      });

      if (selectedSetoresFormatted.length > 1) {
        await downloadMultiSetoresServidorZip(month);
        return;
      }

      await downloadSetorServidorZip(selectedSetoresFormatted[0], month);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const convertServidoresToPdf = async () => {
    if (selectedServidores.length === 0) {
      toast.error("Nenhum servidor foi selecionado");
      return;
    }

    const listOfIdServidor = selectedServidores.map((servidor) => {
      return servidor.id;
    });

    try {
      setIsLoading(true);
      // VERIFIQUE SE O 'ano: year' ESTÁ SENDO ENVIADO AQUI
      const response = await api.post(`/servidores/pdf`, {
        funcionarios: listOfIdServidor,
        mes: month,
        ano: year,
      });

      if (response.status === 200) {
        downloadMultiServidoresZip();
        return;
      }
    } catch (error) {
      console.log("Erro ao gerar servidores zip: ", error);
    } finally {
      setIsLoading(false);
    }
  };



  const handleToggleListOfSetoresServidores = (setor: ISetorServidor) => {
    const isSetorAlreadySelected = selectedSetoresServidores.some(
      ({ id }) => id === setor.id,
    );

    if (isSetorAlreadySelected) {
      setSelectedSetoresServidores((prevSetores) =>
        prevSetores.filter(({ id }) => id !== setor.id),
      );
      return;
    }

    setSelectedSetoresServidores((prevSetores) => {
      if (prevSetores.length >= 10) {
        toast.warning(
          "Máximo permitido é 10 setores ou funcionários selecionados",
        );
        return [...prevSetores.slice(1), setor];
      }

      return [...prevSetores, setor];
    });
  };

  const handleToggleListOfServidores = (servidor: IServidor) => {
    const isServidorAlreadySelected = selectedServidores.some(
      ({ id }) => id === servidor.id,
    );

    if (isServidorAlreadySelected) {
      setSelectedServidores((prevSetores) =>
        prevSetores.filter(({ id }) => id !== servidor.id),
      );
      return;
    }

    setSelectedServidores((prevServidores) => {
      if (prevServidores.length >= 10) {
        toast.warning(
          "Máximo permitido é 10 setores ou funcionários selecionados",
        );
        return [...prevServidores.slice(1), servidor];
      }

      return [...prevServidores, servidor];
    });
  };

  const filterSetoresServidor = (): ISetorServidor[] | undefined => {
    if (setores) {
      let filteredListOfSetores = setores;

      if (search) {
        filteredListOfSetores = filteredListOfSetores?.filter((setor) => {
          return setor.setor.includes(search);
        });
      }
      return filteredListOfSetores;
    }
  };

  const filterServidores = (): IServidor[] | undefined => {
    if (servidores) {
      let filteredListOfServidores = servidores;

      if (search) {
        filteredListOfServidores = filteredListOfServidores?.filter(
          (servidor) => {
            return servidor.nome.includes(search);
          },
        );
      }
      return filteredListOfServidores;
    }
  };

  return {
    selectedServidores,
    selectedSetoresServidores,
    isLoading,
    filterServidores,
    filterSetoresServidor,
    handleToggleListOfServidores,
    handleToggleListOfSetoresServidores,
    convertServidoresToPdf,
    convertSetoresServidorToPdf,
  };
}