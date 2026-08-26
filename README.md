# Fullstack E2E Blueprint

![CI](https://github.com/Beckerr11/fullstack-e2e-blueprint/actions/workflows/ci.yml/badge.svg)

Pequena API HTTP construída para demonstrar uma ideia específica: **testar um fluxo de aplicação de ponta a ponta sem esconder a lógica atrás de mocks**.

O projeto mantém tudo propositalmente compacto. A mesma aplicação que sobe em `npm run dev` é exercitada por testes HTTP reais, cobrindo criação, consulta, filtro, alteração e remoção de tarefas.

## O que existe de fato

- servidor HTTP em Node.js;
- armazenamento em memória isolado por instância;
- criação de tarefas com UUID;
- listagem e filtro por status;
- consulta individual;
- toggle de conclusão;
- remoção;
- validação de título, JSON e filtro;
- limite de payload de 1 MB;
- health check;
- página HTML mínima para inspeção manual;
- testes unitários/smoke e um fluxo E2E HTTP completo.

## Fluxo E2E verificado

O teste principal sobe a aplicação em uma porta efêmera e executa, via HTTP:

```text
GET / → POST task A → POST task B → PATCH toggle
→ GET filtro done=true → GET por id → DELETE
→ payload inválido → filtro inválido → listagem final
```

Isso valida o contrato externo do serviço, não apenas funções internas.

## Endpoints

| Método | Rota | Objetivo |
| --- | --- | --- |
| `GET` | `/` | página de apresentação do serviço |
| `GET` | `/health` | health check |
| `GET` | `/api/tasks` | listar tarefas; aceita `?done=true|false` |
| `POST` | `/api/tasks` | criar tarefa |
| `GET` | `/api/tasks/:id` | consultar tarefa |
| `PATCH` | `/api/tasks/:id/toggle` | alternar conclusão |
| `DELETE` | `/api/tasks/:id` | remover tarefa |

## Executando

Requer Node.js moderno com `fetch` nativo.

```bash
npm ci
npm test
npm run test:e2e
npm run dev
```

Por padrão o servidor usa `PORT=3000`.

## Estrutura

```text
src/
├── app.js      # domínio + handler HTTP
└── index.js    # inicialização do servidor

tests/
└── e2e.test.js # fluxo HTTP ponta a ponta
```

## Decisões de engenharia

**Sem framework HTTP:** o projeto usa `node:http` para deixar explícitos roteamento, parsing e respostas. Não é uma recomendação universal; é uma escolha didática para tornar o contrato observável.

**Store em memória:** persistência real está fora do escopo. Cada processo começa limpo, o que mantém o blueprint determinístico e adequado para testes.

**Erros simples:** entradas inválidas retornam `400`; rotas inexistentes retornam `404`. O projeto prioriza clareza do fluxo em vez de uma taxonomia extensa de erros.

## Qualidade

- GitHub Actions executa a suíte automaticamente;
- Dependabot acompanha dependências/configuração do ecossistema;
- o E2E cria um servidor real em porta efêmera;
- cenários inválidos fazem parte do contrato testado.

## Limites explícitos

Este repositório **não é** um SaaS completo nem uma API de produção. Não possui banco persistente, autenticação, filas ou observabilidade distribuída. Ele existe para demonstrar desenho de contratos HTTP e estratégia de testes end-to-end em uma base pequena e auditável.

## Autor

**Douglas Silva**  
[GitHub](https://github.com/Beckerr11) · [Portfólio](https://douglasdev.tech)
