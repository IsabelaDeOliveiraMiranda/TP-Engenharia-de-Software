## Escolhas de tecnologias
### Frontend - React Native
Permite construir um único código que roda tanto em Android quanto em iOS, acelerando o desenvolvimento e reduzindo o esforço de manutenção.
### Backend - Node.js + Express
Facilita a criação de endpoints REST de forma simples e tem ampla disponibilidade de pacotes úteis (autenticação, validação, ORM). 
### Banco de Dados - PostgreSQL
É um banco relacional confiável que garante integridade transacional, importante para manter o histórico de prescrições e agendamentos corretos.
### Fila/Worker - Redis(fila) + worker em Node/Python
Desacopla tarefas demoradas (envio de notificações, retries, integrações externas) usando uma fila baseada em Redis consumida por workers. Essa separação evita que operações longas travem as respostas da API, permite retries e escalonamento independente do processamento em background e facilita testar e monitorar os jobs.
### Infra/CI - Docker + GitHub Actions 
Docker empacota os serviços (API, banco, worker) e GitHub Actions automatiza build e testes, tornando o ambiente reprodutível e reduzindo problemas.
## Projeto arquitetural elaborado
### Containers principais
- Frontend: interface móvel que consome a API.
- API Backend: valida, orquestra regras e expõe endpoints REST.
- Banco (Postgres): persistência de usuários, medicamentos e agendamentos.
- Scheduler: cria agendamentos e transforma em jobs.
- Fila(Redis) + Worker: processa jobs assíncronos (envio de notificações).
- Serviços externos: provedores de push/email e outras integrações.
### Componentes do Backend
- Auth Controller: login, registro e JWT.
- Medicamento Service: CRUD e regras de negócio.
- Repository/DB Adapter: acesso a Postgres.
- Queue Adapter / Worker Handlers: enfileiramento, retry e envio.
### Fluxo típico
1) Login: Frontend → POST /auth/login → API retorna JWT.
2) CRUD: Frontend → API → DB para gerenciar medicamentos.
3) Agendamento: API grava agendamento → Scheduler enfileira job.
4) Processamento: Worker consome job → chama serviço externo → registra resultado.
