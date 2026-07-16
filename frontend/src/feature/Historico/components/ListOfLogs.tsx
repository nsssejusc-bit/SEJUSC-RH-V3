import useListOfLogs from "../hooks/useListOfLogs";

type ListOfLogsProps = {
  filterOptions: {
    checkbox: string;
    search: string;
  };
};

export default function ListOfLogs({ filterOptions }: ListOfLogsProps) {
  const { checkbox, search } = filterOptions;
  const { filterLogs, formatedDate } = useListOfLogs(checkbox, search);

  /**
   * Formata a mensagem do log para usar a terminologia mais recente ("inativou"/"reativou"),
   * mesmo que o dado no banco de dados ainda use os termos antigos ("arquivou"/"desarquivou").
   */
  const formatMessage = (message: string) => {
  return message
    .replace(/arquivou/g, "inativou")
    .replace(/desarquivou/g, "reativou")
    .replace(/desinativou/g, "reativou"); // <- adicionado
};


  return (
    <section className="flex flex-col gap-4 overflow-y-scroll rounded bg-gray-100 p-4">
      {filterLogs()?.map(({ id, mensagem, data_criacao }) => (
        <div className="rounded bg-slate-300 p-3" key={id}>
          <p className="mb-1 text-lg font-medium">{formatMessage(mensagem)}</p>
          <span>{formatedDate(data_criacao)}</span>
        </div>
      ))}
    </section>
  );
}

