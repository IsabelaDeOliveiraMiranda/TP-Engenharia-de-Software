## CU-02: Listar Medicamentos
Este Caso de Uso permite ao usuário visualizar todos os medicamentos cadastrados.

### CT-02.01 (Sucesso): Exibir lista com medicamentos.
Objetivo: Verificar se os medicamentos cadastrados são exibidos corretamente.
Passos:
- Cadastrar "Dipirona 500mg" e "Paracetamol 750mg".
- Navegar para a tela "Listar Medicamentos".
- Resultado Esperado: A tela deve exibir dois itens: "Dipirona 500mg" e "Paracetamol 750mg".

### CT-02.02 (Caminho Alternativo): Exibir lista vazia.
Objetivo: Verificar como o sistema se comporta quando não há medicamentos.
Passos:
- Garantir que o banco de dados esteja limpo (sem medicamentos).
- Navegar para a tela "Listar Medicamentos".
Resultado Esperado: A tela deve exibir uma mensagem como "Nenhum medicamento cadastrado."

### CT-02.03 (Sucesso): Ordenação da lista.
Objetivo: Verificar se a lista é exibida em ordem alfabética.
Passos:
- Cadastrar "Zolpidem".
- Cadastrar "Aspirina".
- Navegar para a tela "Listar Medicamentos".
Resultado Esperado: A lista deve mostrar "Aspirina" antes de "Zolpidem".

## CU-03: Editar Medicamento
Este Caso de Uso permite ao usuário alterar os dados de um medicamento existente.

### CT-03.01 (Sucesso): Editar nome e dose.
Objetivo: Verificar se a alteração de dados funciona.
Passos:
- Ter o medicamento "Dipirona 500mg" na lista.
- Selecionar "Editar" no item "Dipirona".
- Mudar o nome para "Paracetamol" e a dose para "750mg".
- Salvar.
Resultado Esperado: O item na lista deve ser atualizado para "Paracetamol 750mg".

### CT-03.02 (Falha): Tentar salvar com nome vazio.
Objetivo: Verificar a validação de campos obrigatórios.
Passos:
- Acessar a tela de edição de um medicamento.
- Apagar o nome (deixar o campo em branco).
- Tentar salvar.
Resultado Esperado: O app deve mostrar um alerta (ex: "O nome não pode ficar em branco") e não deve salvar a alteração.

### CT-03.03 (Sucesso): Cancelar a edição.
Objetivo: Verificar se a ação de "Cancelar" funciona.
Passos:
- Ter o medicamento "Dipirona 500mg".
- Acessar a tela de edição e mudar o nome para "ABC".
- Clicar no botão "Cancelar".
Resultado Esperado: O app deve voltar à tela anterior e o medicamento deve continuar sendo "Dipirona 500mg".

## CU-04: Excluir Medicamento
Este Caso de Uso permite ao usuário remover um medicamento do sistema.

### CT-04.01 (Sucesso): Excluir um medicamento.
Objetivo: Verificar a remoção bem-sucedida de um item.
Passos:
- Ter o medicamento "Aspirina" cadastrado.
- Na lista, selecionar a opção "Excluir" para "Aspirina".
- Clicar em "Confirmar" no pop-up de alerta.
Resultado Esperado: O medicamento "Aspirina" deve desaparecer da lista.

### CT-04.02 (Sucesso): Cancelar a exclusão.
Objetivo: Verificar se a ação de "Cancelar" a exclusão funciona.
Passos:
- Ter o medicamento "Aspirina".
- Clicar em "Excluir".
- Clicar em "Cancelar" no pop-up de alerta.
Resultado Esperado: O medicamento "Aspirina" deve continuar na lista, sem alterações.

### CT-04.03 (Sucesso): Exclusão de dados associados (Teste de Integridade).
Objetivo: Garantir que, ao excluir um medicamento, seus horários associados também sejam excluídos.
Pré-condição: O medicamento "Dipirona" tem 3 horários cadastrados na tabela horarios.
Passos:
- Excluir o medicamento "Dipirona".
- Confirmar a exclusão.
- Resultado Esperado: O medicamento "Dipirona" E os 3 registros na tabela horarios devem ser apagados do banco de dados.

## CU-06: Criar (Consultar) tela de histórico
Este Caso de Uso permite ao usuário ver o registro de doses que ele já tomou.

### CT-06.01 (Sucesso): Exibir histórico de doses tomadas.
Objetivo: Verificar se os registros de doses são exibidos.
Pré-condição: O usuário registrou que tomou "Dipirona" às 08:00 e "Paracetamol" às 12:00.
Passos:
- Navegar para a tela "Histórico".
- Resultado Esperado: A tela deve mostrar os dois registros, com nome, dose e o horário em que foram tomados.
- CT-06.02 (Caminho Alternativo): Exibir histórico vazio.

Objetivo: Verificar o comportamento com o histórico limpo.
Passos:
- Garantir que não há registros na tabela registros_doses.
- Navegar para a tela "Histórico".
Resultado Esperado: A tela deve mostrar uma mensagem (ex: "Nenhum registro de dose encontrado").

### CT-06.03 (Sucesso): Ordenação do histórico.
Objetivo: Verificar se o histórico é exibido na ordem correta.
Passos:
- Registrar uma dose às 14:00 (hoje).
- Registrar uma dose às 10:00 (hoje).
- Navegar para a tela "Histórico".
Resultado Esperado: A dose das 14:00 (a mais recente) deve aparecer no topo da lista, antes da dose das 10:00.