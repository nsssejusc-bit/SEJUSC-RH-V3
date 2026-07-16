import React, { useEffect, useState } from "react";
import { toast } from "sonner";

import { api } from "@/api";
// 1. IMPORTE OS TIPOS DO SERVIDOR E ESTAGIARIO
import type { IEstagiario, IServidor } from "@/interfaces";
import { Button } from "@/shared";

interface Documento {
  id: number;
  nome_original: string;
  tipo_documento: string;
}

// 2. DEFINA O TIPO DO ESTADO DO MODAL (COPIADO DE FuncionariosPage)
type ModalStateType = {
  servidor: IServidor | null;
  estagiario: IEstagiario | null;
  modal: boolean;
  action: string | null;
};

// 3. ATUALIZE A INTERFACE DE PROPS
interface DocumentoItemProps {
  tipoDocumento: string;
  documentosExistentes: Documento[];
  onFileSelect: (tipoDocumento: string, file: File | null) => void;
  fileToUpload: File | null | undefined;
  // ADICIONE ESTAS DUAS LINHAS:
  isModalOpen: ModalStateType
}

// 4. RECEBA AS NOVAS PROPS AQUI
export default function DocumentoItem({
  tipoDocumento,
  documentosExistentes,
  onFileSelect,
  fileToUpload,
  isModalOpen,
}: DocumentoItemProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isVisualizarOnly = isModalOpen.action === "visualizar";

  const documentoExistente = documentosExistentes.find(
    (doc) => doc.tipo_documento === tipoDocumento,
  );

  useEffect(() => {
    // Limpa a URL de pré-visualização quando o componente é desmontado ou o arquivo é salvo
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Limpa qualquer pré-visualização antiga
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const file = event.target.files?.[0] || null;
    onFileSelect(tipoDocumento, file);
    setFileName(file ? file.name : null);

    if (file) {
      // Cria uma nova URL de pré-visualização para o arquivo selecionado
      setPreviewUrl(URL.createObjectURL(file));
      toast.info(
        `Arquivo "${file.name}" selecionado para ${tipoDocumento}. Clique em "Anexar Documentos" para salvar.`,
      );
    } else {
      setPreviewUrl(null);
    }
  };

  const handleViewDocumento = () => {
    // Se um novo arquivo foi selecionado (ainda não salvo), abre a pré-visualização
    if (previewUrl) {
      window.open(previewUrl, "_blank");
      return;
    }

    // Se não há novo arquivo, abre o documento já salvo no servidor
    if (documentoExistente) {
      const timestamp = new Date().getTime();
      const viewUrl = `${api.defaults.baseURL}/documentos/view/${documentoExistente.id}?v=${timestamp}`;
      window.open(viewUrl, "_blank");
    } else {
      toast.error("Nenhum documento para visualizar.");
    }
  };

  const handleTrocarClick = () => {
    fileInputRef.current?.click();
  };

  const displayName =
    fileName || documentoExistente?.nome_original || "Nenhum arquivo anexado";
  
  const displayTipo = tipoDocumento.replace(/_/g, " ").charAt(0).toUpperCase() + tipoDocumento.replace(/_/g, " ").slice(1).toLowerCase();

  return (
    <div className="flex items-center justify-between rounded p-1.5 font-medium text-slate-800">
      <span>{displayTipo}</span>
      <div className="flex items-center gap-4">
        <span className="truncate text-sm text-gray-700" title={displayName}>
          {displayName}
        </span>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          className="cursor-pointer rounded-full border-2 border-sky-950 bg-transparent px-4 py-1.5 text-sm font-bold tracking-wider text-sky-950 uppercase duration-200 ease-in hover:bg-sky-950 hover:text-sky-100 disabled:opacity-50"
          onClick={handleViewDocumento}
          disabled={!documentoExistente && !previewUrl}
        >
          Ver
        </Button>
        <Button
          className="cursor-pointer rounded-full border-2 border-sky-950 bg-transparent px-4 py-1.5 text-sm font-bold tracking-wider text-sky-950 uppercase duration-200 ease-in hover:bg-sky-950 hover:text-sky-100"
          onClick={handleTrocarClick}
          disabled={isVisualizarOnly}
        >
          {documentoExistente || fileToUpload ? "Trocar" : "Anexar"}
        </Button>
      </div>
    </div>
  );
}

