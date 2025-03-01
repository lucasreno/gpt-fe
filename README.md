# GPT Frontend

## Descrição

Este projeto é um frontend para o GPT Backend, fornecendo uma interface web para interagir com a API de conversação. O sistema permite que os usuários iniciem conversas e enviem mensagens para consultar o banco de dados através de linguagem natural, visualizando as respostas de forma amigável.

## Pré-requisitos

- Node.js v18 ou superior
- NPM ou Yarn
- [GPT Backend](https://github.com/lucasreno/gpt-be) configurado e em execução

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/lucasreno/gpt-fe.git
   cd gpt-fe
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente copiando o arquivo `.env` de exemplo e ajustando conforme necessário:
   ```bash
   cp .env.example .env
   ```

## Configuração

Edite o arquivo `.env` com suas configurações:

```
# URL da API do GPT Backend
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

```

## Executando a aplicação

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:3001`.

Para build de produção:

```bash
npm run build
```

Para visualizar a versão de produção localmente:

```bash
npm run start
```

## Como usar

1. Acesse a interface web após iniciar o aplicativo
2. Inicie uma nova conversa clicando no botão "Nova conversa"
3. Digite suas perguntas na caixa de texto na parte inferior
4. Visualize as respostas do GPT na área principal da conversa
5. É possível consultar o histórico de conversas anteriores no painel lateral

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
