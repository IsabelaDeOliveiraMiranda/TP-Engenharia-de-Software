## Escolhas de tecnologias
### Frontend
React Native: Permite construir um único código que roda tanto em Android quanto em iOS, acelerando o desenvolvimento e reduzindo o esforço de manutenção.
### Backend
Node.js + Express: Faz criação de endpoints REST de forma simple, tem ampla disponibilidade de pacotes úteis (autenticação, validação, ORM). 
### Banco de Dados
PostgreSQL: É um banco relacional confiável que garante integridade transacional, algo importante para manter o histórico de prescrições e agendamentos corretos.
### Fila/Worker  
Redis(fila) + worker em Node/Python: Desacopla tarefas demoradas (envio de notificações, retries, integrações externas) usando uma fila baseada em Redis consumida por workers. Essa separação evita que operações longas travem as respostas da API, permite retries e escalonamento independente do processamento em background, e facilita testar e monitorar os jobs. 
### Infra/CI 
Docker + GitHub Actions: Docker para empacotar os serviços (API, banco, worker) e GitHub Actions para automatizar build e testes.
