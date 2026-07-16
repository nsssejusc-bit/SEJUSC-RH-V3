# PERMISSIONS — Mapeamento atual de autenticação e autorização

Este arquivo foi gerado automaticamente para resumir quais rotas possuem proteção por autenticação (`login_required`) e/ou autorização por papéis/roles (`roles_required`). Baseado no código atual da branch `novas-informaçẽs-no-banco-de-dados` (arquivos no diretório `routes/`, `auth.py` e `decorador.py`).

Observações rápidas
- O decorador de roles está em `decorador.py` e verifica `current_user.role` (aceita string ou lista). Se o usuário não tiver nenhum dos roles exigidos, retorna 403.
- O campo `role` é carregado a partir da tabela `usuarios` em `auth.py` e também é retornado no endpoint de login.
- Muitas rotas têm os decorators comentados (`#@roles_required(...)` ou `#@login_required`) — isso indica intenção de proteção que está desativada no código atual.

Legenda
- Ativo: o decorator está presente e sem comentário (a verificação será executada em tempo de requisição).
- Comentado: o decorator aparece no arquivo mas está comentado (não tem efeito atualmente).
- Ausente: não há decorator no arquivo.

Resumo por role
- `admin`: em termos práticos, pode executar o que tiver rotas protegidas com `roles_required('admin')` — no código atual há várias rotas onde essa restrição está planejada (comentada), mas poucas ativas.
- `editor`: atua junto com `admin` em rotas protegidas por `('admin','editor')` — rotas ativas com essa proteção permitem que ambos os papéis executem a ação.

Mapeamento detalhado (rotas encontradas)

- File: `routes/criar_servidor.py`
  - Route: `POST /api/criar/servidores`
  - `login_required`: Ativo
  - `roles_required`: Ativo — roles: `admin`, `editor`
  - O que permite: criação de registros na tabela `funcionarios` (criar servidor).

- File: `routes/ultimos_cadastros.py`
  - Route: `GET /api/ultimos-cadastros`
  - `login_required`: Ativo
  - `roles_required`: Ativo — roles: `admin`, `editor`
  - O que permite: visualizar últimos cadastros (servidores) — rota filtrada pelo `current_user.id`.

- File: `routes/atualizar_servidores.py`
  - Route: `PATCH /api/servidores/<int:id>`
  - `login_required`: Comentado
  - `roles_required`: Comentado — intenção: `('admin','editor')`
  - O que permite (se ativado): atualizar dados do funcionário/servidor.

- File: `routes/arquivar.py`
  - Route: `PATCH /api/servidores/<int:id>/arquivar`
  - `login_required`: Comentado
  - `roles_required`: Comentado — intenção: `('admin')`
  - O que permite (se ativado): marcar servidor como `arquivado`.

- File: `routes/arquivar_estagiario.py`
  - Route: `PATCH /api/estagiarios/<int:id>/arquivar`
  - `login_required`: Comentado
  - `roles_required`: Comentado — intenção: `('admin')`
  - O que permite (se ativado): marcar estagiário como `arquivado`.

- File: `routes/ativar_estagiario.py`
  - Route: `PATCH /api/estagiarios/<int:id>/atualizar-status`
  - `login_required`: Comentado
  - `roles_required`: Comentado — intenção: `('admin')`
  - O que permite (se ativado): reativar/atualizar status de estagiário para `ativo`.

- File: `routes/busca_setor_estagiario.py`
  - Route: `GET /api/setor/estagiarios`
  - `login_required`: Ausente
  - `roles_required`: Comentado — intenção: `('admin','editor')`
  - O que retorna: lista de setores/lotação de estagiários (agrupamento).

- File: `routes/buscar_setor.py`
  - Route: `GET /api/buscar_setor`
  - `login_required`: Ausente
  - `roles_required`: Ausente (import presente, mas não aplicado)
  - O que retorna: setores distintos (consulta à tabela `funcionarios`).

- File: `routes/buscar_todos.py`
  - Route: `GET /api/servidores`
  - `login_required`: Comentado
  - `roles_required`: Comentado — intenção: `('admin','editor')`
  - O que retorna: listagem de servidores (com filtros). 

- File: `routes/listar_pdfs.py`
  - Route: `GET /api/servidores/pdfs`
  - `login_required`: Comentado
  - `roles_required`: Comentado — intenção: `('admin','editor')`
  - O que retorna: árvore de PDFs na pasta `setor/`.

- File: `routes/listar_pdfs_estagiarios.py`
  - Route: `GET /api/estagiarios/pdfs`
  - `login_required`: Comentado
  - `roles_required`: Comentado — intenção: `('admin','editor')`
  - O que retorna: árvore de PDFs na pasta `setor/` (estagiários).

- File: `routes/converte_estagiario.py`
  - Route: `POST /api/estagiario/pdf`
  - `login_required`: Ausente
  - `roles_required`: Ausente
  - O que permite: gerar PDFs/ZIPs de frequência para estagiários e inserir registro em `arquivos_zip`.

- File: `routes/gerar_ficha_funcional.py`
  - Route: `POST /api/servidores/<int:funcionario_id>/gerar-ficha-funcional`
  - `login_required`: Ausente
  - `roles_required`: Ausente
  - O que permite: gerar ficha funcional em PDF e salvar registro em `documentos`.

- File: `routes/historico_logs/criar_historico.py`
  - Route: `POST /api/historico-logs`
  - `login_required`: Ausente
  - `roles_required`: Ausente
  - O que permite: inserir registro de histórico (mensagem, nome, ação).

- File: `routes/historico_logs/buscar_historico.py`
  - Route: `GET /api/historico-logs`
  - `login_required`: Ausente
  - `roles_required`: Ausente
  - O que permite: listar registros de histórico.

- File: `routes/send.py`
  - Routes: `GET /api/servidores/pdf/download-zip/<mes>` e `GET /api/estagiarios/pdf/download-zip/<mes>`
  - `login_required`: Ausente
  - `roles_required`: Ausente
  - O que permite: baixar ZIPs gerados (procura último registro em `arquivos_zip`).

- File: `routes/send_setores.py`
  - Routes: `GET /api/setores/pdf/download-zip/<setor>/<mes>` e `GET /api/setores/estagiarios/<setor>/<mes>`
  - `login_required`: Ausente
  - `roles_required`: Ausente
  - O que permite: baixar ZIPs por setor (funcionários ou estagiários).

- File: `routes/buscar_documentos.py`
  - Route: `GET /api/buscar/documentos`
  - `login_required`: Ausente
  - `roles_required`: Ausente
  - O que permite: listar documentos por `funcionario_id` ou `estagiario_id`.

- File: `routes/buscar_arquivados_estagiarios.py`
  - Route: `GET /api/estagiarios/arquivados`
  - `login_required`: Ausente
  - `roles_required`: Ausente
  - O que permite: listar estagiários com `status = 'arquivado'`.

Endpoints de autenticação (em `auth.py`)
- `POST /api/login` — realiza autenticação e retorna `role` no payload de resposta (útil para front-end). Não requer autenticação.
- `POST /logout` — possui `@login_required` (apenas usuários logados podem deslogar).

Recomendações rápidas
1. Documentar explicitamente (arquivo criado) e decidir a política definitiva para cada rota (quais devem exigir `login` e quais devem exigir `roles`).
2. Habilitar os decorators comentados nas rotas onde a proteção é necessária. Por exemplo:
   - `arquivar` / `arquivar_estagiario` / `ativar_estagiario` provavelmente devem ser `admin`.
   - `criar_*` e `atualizar_*` podem ser `admin` e `editor` dependendo da sua regra de negócio.
3. Padronizar o formato do campo `usuarios.role` (recomendo armazenar lista/JSON quando houver múltiplos roles), ou manter string única e ajustar o decorador para suportar fielmente esse formato.
4. Adicionar testes automatizados que tentem acessar rotas com usuários de roles diferentes e verifiquem respostas 200/403.

Se quiser, eu posso:
- Gerar automaticamente um `PERMISSIONS.md` mais detalhado (ex: com sugestões de quais decorators ativar) — posso aplicar as alterações no código para ativar decorators comentados conforme uma política que você indicar.
- Gerar testes de integração simples para validar políticas de acesso.

Arquivo gerado automaticamente.
