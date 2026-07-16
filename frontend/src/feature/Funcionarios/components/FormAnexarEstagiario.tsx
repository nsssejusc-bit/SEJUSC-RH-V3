import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { api } from "@/api";
import type { IEstagiario, IServidor } from "@/interfaces";
import { Button } from "@/shared";

import ConfirmationModal from "./ConfirmationModal";
import DocumentoItem from "./DocumentoItem";

interface Documento {
  id: number;
  nome_original: string;
  tipo_documento: string;
}
// Em FormAnexarServidor.tsx (e Estagiario)

// 1. Defina o tipo completo do estado do modal (logo abaixo dos imports)
type ModalStateType = {
  servidor: IServidor | null;
  estagiario: IEstagiario | null;
  modal: boolean;
  action: string | null;
};

// 2. Use esse tipo na sua interface de props
type FormAnexarEstagiarioProps = { // (ou FormAnexarEstagiarioProps)
  isModalOpen: ModalStateType; // <-- CORRIGIDO
  setIsModalOpen: React.Dispatch<React.SetStateAction<ModalStateType>>;
};

const tiposDeDocumento = [
  "RG",
  "CPF",
  "TITULO_ELEITOR",
  "PIS_PASEP",
  "CERTIDAO_RESERVISTA",
  "COMPROVANTE_ESCOLARIDADE",
  "FOTO_3X4",
  "CERTIDAO_NASCIMENTO",
  "CURRICULO",
];

export default function FormAnexarEstagiario({
  isModalOpen,
  setIsModalOpen,
}: FormAnexarEstagiarioProps) {
  const { estagiario } = isModalOpen;
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<
    Record<string, File | null>
  >({});
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  const fetchDocumentos = async () => {
    if (!estagiario) return;
    try {
      const response = await api.get("/buscar/documentos", {
        params: { estagiario_id: estagiario.id },
      });
      setDocumentos(response.data.documentos || []);
    } catch (error) {
      toast.error("Erro ao buscar documentos existentes.");
    }
  };

  useEffect(() => {
    fetchDocumentos();
  }, [estagiario]);

  const handleFileChange = (tipoDocumento: string, file: File | null) => {
    setFilesToUpload((prev) => ({ ...prev, [tipoDocumento]: file }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    let hasFiles = false;

    for (const tipo in filesToUpload) {
      const file = filesToUpload[tipo];
      if (file) {
        formData.append("files", file);
        formData.append("tipos_documento", tipo);
        hasFiles = true;
      }
    }

    if (!hasFiles) {
      toast.info("Nenhum novo arquivo selecionado para upload.");
      return;
    }

    if (estagiario?.id) {
      formData.append("estagiario_id", String(estagiario.id));
    }

    try {
      await api.post("/documentos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Documentos enviados com sucesso!");
      setFilesToUpload({});
      await fetchDocumentos(); // Re-fetch documents to show the updated list
    } catch (error) {
      toast.error("Falha ao enviar documentos.");
    }
  };

  const handleClose = () => {
    if (Object.values(filesToUpload).some((file) => file !== null)) {
      setIsExitModalOpen(true);
    } else {
      closeAndReset();
    }
  };

  const closeAndReset = () => {
    setIsModalOpen({
      servidor: null,
      estagiario: null,
      modal: false,
      action: null,
    });
    setFilesToUpload({});
    setIsExitModalOpen(false);
  };

  return (
    <div className="w-full max-w-4xl">
      <ConfirmationModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirm={closeAndReset}
        title="Sair sem Salvar?"
        message={
          <>
            <p>Você realizou alterações que ainda não foram salvas.</p>
            <p>Se sair agora, todas as modificações serão perdidas.</p>
          </>
        }
      />
      <h1 className="pb-8 text-4xl font-semibold text-sky-950">
        Gerenciar Anexos do Estagiário: {estagiario?.nome}
      </h1>
      <div className="flex flex-col gap-4">
        {tiposDeDocumento.map((tipo) => (
          <DocumentoItem
            key={tipo}
            tipoDocumento={tipo}
            documentosExistentes={documentos}
            onFileSelect={handleFileChange}
            fileToUpload={filesToUpload[tipo]}
            isModalOpen={isModalOpen}
          />
                  ))}
      </div>
      <div className="flex justify-start gap-4 pt-8">
        <Button onClick={handleSubmit}>Salvar Anexos</Button>
        <Button type="button" onClick={handleClose}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}

