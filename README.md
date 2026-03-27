# fullstack-e2e-blueprint

![CI](https://github.com/Beckerr11/fullstack-e2e-blueprint/actions/workflows/ci.yml/badge.svg)

Blueprint fullstack com foco em testes.

## Objetivo
Este repositorio faz parte de uma trilha de portfolio profissional full stack, com foco em simplicidade, clareza e boas praticas.

## Stack
Node.js, testes smoke e E2E

## Funcionalidades implementadas
- API de tarefas com filtros e validacoes
- Fluxo E2E HTTP completo (create-toggle-delete)
- Teste de cenarios invalidos
- Base pronta para ampliar com frontend

## Como executar
~~~bash
npm ci
npm test
npm run dev
~~~

## Scripts uteis
- npm run dev, npm test, npm run test:e2e

## Qualidade
- CI em .github/workflows/ci.yml
- Dependabot em .github/dependabot.yml
- Testes locais obrigatorios antes de merge

## Documentacao
- [Roadmap](docs/ROADMAP.md)
- [Checklist de producao](docs/PRODUCTION-CHECKLIST.md)
- [Contribuicao](CONTRIBUTING.md)
- [Seguranca](SECURITY.md)

## Status
- [x] Scaffold inicial
- [x] Base funcional com testes
- [ ] Deploy publico com observabilidade completa
- [ ] Versao 1.0.0 com demo publica
