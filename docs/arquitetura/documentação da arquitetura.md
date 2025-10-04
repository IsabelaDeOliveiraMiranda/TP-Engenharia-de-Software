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
## Justificativa do modelo escolhido
A arquitetura em containers com API stateless e processamento assíncrono foi adotada por atender aos requisitos funcionais e não funcionais: entregar respostas rápidas ao usuário, garantir integridade do histórico de prescrições e permitir envio confiável de notificações.
### Escalabilidade e desempenho
A separação entre API e workers permite escalonamento independente: a API pode escalar horizontalmente para atender a muitas requisições simultâneas, enquanto os workers escalam conforme a demanda por processamento de jobs. A fila (Redis) desacopla produtores e consumidores, evitando sobrecarga da API em picos de carga.
### Responsividade e experiência do usuário
Ao delegar tarefas demoradas (envio de push, integrações externas) aos workers, a API mantém baixa latência nas respostas ao cliente, melhorando a fluidez do aplicativo móvel e reduzindo ocorrência de timeouts percebidos pelo usuário.
### Consistência e integridade dos dados
O uso de PostgreSQL garante transações e integridade referencial para usuários, prescrições e agendamentos, requisito importante para auditoria e prevenção de duplicidade ou perda de registros críticos.
### Resiliência no processamento de notificações
A fila possibilita estratégias de retry, backoff e dead‑letter queue para jobs falhos, aumentando a confiabilidade na entrega de notificações sem impactar a operação da API.
### Simplicidade operacional e reprodutibilidade
A adoção de Docker e pipelines de CI (GitHub Actions) torna os ambientes reprodutíveis, facilita testes automatizados em pull requests e reduz problemas de inconsistência entre ambientes de desenvolvimento e produção.
### Segurança e escalabilidade operacional
A autenticação stateless por JWT simplifica o escalonamento horizontal sem necessidade de sessão compartilhada; práticas como validação de entrada, uso de HTTPS e controle de escopo em tokens atendem aos requisitos básicos de segurança.
### Trade‑offs
A solução privilegia experiência do usuário e escalabilidade em detrimento de maior complexidade operacional (monitoramento de filas, workers e políticas de retry), um compromisso considerado adequado para garantir disponibilidade e confiabilidade no envio de notificações.
