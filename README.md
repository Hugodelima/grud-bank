### Resumo do Projeto

Este é um aplicativo simples de gerenciamento de pedidos de lavanderia. Ele permite adicionar, editar e remover pedidos de clientes, com controle de status (pendente, em andamento, concluído). Os dados dos pedidos são armazenados localmente no navegador usando `localStorage`, garantindo que os pedidos persistam após recarregar a página.

### Funcionalidades
- **Adicionar Pedido**: Insere um novo pedido com nome do cliente, tipo de serviço e status.
- **Editar Pedido**: Permite alterar os dados de um pedido existente.
- **Excluir Pedido**: Remove um pedido da lista.
- **Persistência de Dados**: Os pedidos são salvos no `localStorage` e carregados automaticamente ao abrir a aplicação.

### Tecnologias Utilizadas
- React (useState, useEffect)
- TypeScript
- CSS
- `localStorage` para persistência de dados

### Como Executar
1. Clone o repositório.
2. Instale as dependências com `npm install`.
3. Execute o projeto com `npm start`.
4. Acesse o aplicativo no navegador em `http://localhost:3000`.

