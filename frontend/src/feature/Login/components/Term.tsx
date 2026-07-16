export default function Term() {
  return (
    <section>
      <div className="mb-6">
        <h1 className="mb-2 text-lg font-semibold">Objetivo</h1>
        <p className="mb-2">
          A Secretaria de Estado de Justiça, Direitos Humanos e Cidadania
          (SEJUSC) emprega os melhores esforços para fornecer medidas de
          proteção adequadas em todas as suas operações e para implementar
          políticas e procedimentos consistentes, efetivos e rigorosos no
          tratamento de dados pessoais.
        </p>
        <p className="mb-2">
          Por reconhecer a importância da sua privacidade, desenvolvemos esta
          Política de Privacidade para o Sistema SEJUSC RH, a fim de informar
          servidores, estagiários e usuários autorizados sobre as condições sob
          as quais tratamos e protegemos os dados pessoais inseridos e
          armazenados neste sistema.
        </p>
        <p className="mb-2">
          Ao aceitar esta Política, você está ciente de que a SEJUSC é a
          Controladora dos dados pessoais tratados no SEJUSC RH e declara estar
          de acordo com as disposições aqui apresentadas.
        </p>
      </div>
      <div className="mb-6">
        <h1 className="mb-2 text-lg font-semibold">Finalidade do Tratamento</h1>
        <p className="mb-2">
          O SEJUSC RH tem como finalidade exclusiva apoiar a gestão de
          servidores e estagiários da SEJUSC, servindo como ferramenta
          complementar ao sistema RHPRODAM, atualmente utilizado como sistema
          oficial.
        </p>
        <p className="mb-2">
          O sistema foi desenvolvido para facilitar a rotina do setor de
          Recursos Humanos da SEJUSC, permitindo:
        </p>
        <ul className="flex list-inside list-disc flex-col gap-2">
          <li>Geração da fliha de frequência;</li>
          <li>
            Registro e atualização de dados cadastrais de servidores e
            estagiários;
          </li>
          <li>
            Armazenamento de documentações (RG, CPF, CNH, comprovante de
            residência, entre outros);
          </li>
          <li>Controle de férias;</li>
          <li>Dashboards e relatórios de gestão.</li>
        </ul>
      </div>
      <div className="mb-6">
        <h1 className="mb-2 text-lg font-semibold">Dados Pessoais Tratados</h1>
        <p className="mb-2">
          No âmbito do SEJUSC RH, poderão ser tratados os seguintes dados
          pessoais:
        </p>
        <ul className="mb-2 flex list-inside list-disc flex-col gap-2">
          <li>
            Dados de identificação: nome completo, filiação, data de nascimento,
            sexo, estado civil, número do RG, número do CPF, CNH, título de
            eleitor;
          </li>
          <li>Dados de contato: endereço residencial, telefone, e-mail;</li>
          <li>
            Documentos de comprovação: cópias digitais de RG, CPF, CNH,
            comprovante de residência, entre outros necessários para gestão
            administrativa.
          </li>
        </ul>
        <p>⚠️ Dados bancários não são tratados neste sistema.</p>
      </div>
      <div className="mb-6">
        <h1 className="mb-2 text-lg font-semibold">
          Compartilhamento de Dados
        </h1>
        <p className="mb-2">
          Os dados registrados no SEJUSC RH não são compartilhados com
          terceiros, exceto quando formalmente solicitados por órgãos de
          controle ou quando houver determinação legal ou judicial.
        </p>
      </div>
      <div className="mb-6">
        <h1 className="mb-2 text-lg font-semibold">Medidas de Segurança</h1>
        <p className="mb-2">
          O acesso ao SEJUSC RH é restrito a servidores autorizados, mediante
          login e senha individual, com perfis de permissão definidos de acordo
          com a função.
        </p>
        <p className="mb-2">Entre as medidas adotadas, destacam-se:</p>
        <ul className="mb-2 flex list-inside list-disc flex-col gap-2">
          <li>Controle de acesso por credenciais individuais;</li>
          <li>Registro de logs de acesso e operações;</li>
          <li>Política de backup periódico;</li>
          <li>Monitoramento e suporte técnico da GTI/SEJUSC.</li>
        </ul>
        <p>
          ⚠️ Atualmente, não há implementação de criptografia de dados
          sensíveis, mas a SEJUSC se compromete a adotar medidas de melhoria
          contínua em segurança da informação.
        </p>
      </div>
      <div className="mb-6">
        <h1 className="mb-2 text-lg font-semibold">Relação com o PRODAMRH</h1>
        <p className="mb-2">
          O SEJUSC RH não substitui o sistema RHPRODAM, que permanece como o
          sistema oficial da Administração Estadual para gestão de pessoal.
        </p>
        <p>
          Este sistema foi desenvolvido como ferramenta complementar, voltada a
          suprir funcionalidades não disponíveis no RHPRODAM, proporcionando
          maior eficiência operacional e melhor suporte à rotina dos servidores
          de Recursos Humanos.
        </p>
      </div>
      <div className="mb-6">
        <h1 className="mb-2 text-lg font-semibold">
          Exercício de Direitos pelo Titular
        </h1>
        <p className="mb-2">
          A SEJUSC respeita os direitos assegurados pela Lei Geral de Proteção
          de Dados Pessoais (Lei nº 13.709/2018).
        </p>
        <p className="mb-2">
          Os titulares de dados pessoais poderão, mediante requisição formal,
          solicitar:
        </p>
        <ul className="flex list-inside list-disc flex-col gap-2">
          <li>Acesso às informações pessoais registradas no sistema;</li>
          <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>
            Anonimização, bloqueio ou eliminação de dados desnecessários,
            excessivos ou tratados em desconformidade com a LGPD.
          </li>
          <li>
            As solicitações devem ser encaminhadas ao Encarregado de Proteção de
            Dados da SEJUSC, conforme canais de contato disponíveis no portal
            institucional.
          </li>
        </ul>
      </div>
      <div className="mb-6">
        <h1 className="mb-2 text-lg font-semibold">Disposições Finais</h1>
        <p>
          Esta Política poderá ser revisada a qualquer tempo, visando sua
          adequação a novas legislações, normativas internas ou evoluções
          tecnológicas do sistema. Recomendamos que os usuários consultem
          periodicamente a versão mais atualizada.
        </p>
      </div>
    </section>
  );
}
