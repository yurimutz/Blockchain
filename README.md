# Turing dApp (ERC-20 Voting System)

Aplicação descentralizada (dApp) desenvolvida com **Hardhat**, **Solidity (OpenZeppelin ERC-20)** e **React** para votação e emissão de tokens **Turing (Tur)**.

---

## Pré-requisitos

- **Node.js** (v18+ recomendado) e **npm**
- Extensão **MetaMask** instalada no navegador

### Instalação das dependências

1. Instale as dependências do projeto Hardhat (raiz do projeto `hardhat-tutorial`):
   ```bash
   cd hardhat-tutorial
   npm install
   ```

2. Instale as dependências do Frontend:
   ```bash
   cd frontend
   npm install
   ```

---

## Parte 1: Deploy Local (Hardhat Network)

Ideal para desenvolvimento e testes rápidos usando as contas locais geradas pelo Hardhat.

### 1. Subir a Blockchain Local
Em um terminal na pasta `hardhat-tutorial`, inicie o nó local do Hardhat:
```bash
cd hardhat-tutorial
npx hardhat node
```
> **Nota:** Esse terminal exibirá 20 contas de teste com suas respectivas *Private Keys* e ficará rodando em `http://127.0.0.1:8545` (Chain ID `31337`). **Mantenha este terminal aberto.**

### 2. Fazer o Deploy do Contrato Localmente
Abra um **segundo terminal** na pasta `hardhat-tutorial` e execute o script de deploy apontando para `localhost`:
```bash
cd hardhat-tutorial
npx hardhat run scripts/deploy.js --network localhost
```
> O script `scripts/deploy.js` compilará o contrato `Turing.sol`, fará o deploy na rede local e atualizará automaticamente os arquivos `frontend/src/contracts/contract-address.json` e `frontend/src/contracts/Token.json`.

### 3. Configurar o MetaMask (Rede Local)
1. Abra o MetaMask e adicione/selecione a rede **Localhost 8545**:
   - **URL do RPC:** `http://127.0.0.1:8545`
   - **ID da Cadeia (Chain ID):** `31337`
   - **Símbolo da Moeda:** `ETH`
2. Importe uma ou mais contas exibidas no terminal do `npx hardhat node` usando a **Chave Privada (Private Key)**:
   - **Conta #0 (`0xf39Fd6...`):** É o `owner` do contrato (Superusuário).
   - **Contas #1 a #19:** Correspondem aos alunos `nome1` a `nome19` pré-cadastrados no construtor do contrato.

### 4. Iniciar o Frontend
Em um terminal na pasta `hardhat-tutorial/frontend`, inicie o servidor React:
```bash
cd hardhat-tutorial/frontend
npm start
```
Acesse [http://localhost:3000](http://localhost:3000) no navegador e conecte sua carteira MetaMask.

---

## Parte 2: Deploy na Testnet Sepolia

Para publicar e interagir com o contrato na rede de testes pública **Ethereum Sepolia**.

### 1. Configurar as Variáveis do Hardhat (`INFURA_API_KEY` e `SEPOLIA_PRIVATE_KEY`)
O arquivo `hardhat.config.js` utiliza o sistema `vars` do Hardhat para armazenar chaves de forma segura:

1. Crie uma conta em [Infura](https://infura.io/) (ou MetaMask Developer) e copie sua **API Key**.
2. Exporte a **Private Key** da sua conta MetaMask que possui **SepoliaETH** (você pode obter SepoliaETH gratuitamente em faucets como Google Cloud Web3 Faucet ou Alchemy Sepolia Faucet).
3. Na pasta `hardhat-tutorial`, configure as variáveis no Hardhat:
   ```bash
   cd hardhat-tutorial
   npx hardhat vars set INFURA_API_KEY
   npx hardhat vars set SEPOLIA_PRIVATE_KEY
   ```

### 2. Fazer o Deploy na Sepolia (Nao foi testado pois a atividade so usara o deploy local)
Na pasta `hardhat-tutorial`, execute o comando de deploy especificando a rede `sepolia`:
```bash
cd hardhat-tutorial
npx hardhat run scripts/deploy.js --network sepolia
```
> Assim como no deploy local, o script salvará automaticamente o novo endereço do contrato na Sepolia em `frontend/src/contracts/contract-address.json` e o ABI atualizado em `frontend/src/contracts/Token.json`.

### 3. Configurar o MetaMask e Iniciar o Frontend
1. No **MetaMask**, mude a rede selecionada para **Sepolia Test Network**.
2. Caso utilize endereços reais de alunos na Sepolia (diferentes dos endereços de teste do Hardhat), conecte-se com a conta **Owner** (a conta que fez o deploy) ou da **Professora (`roberta`)** e utilize a seção **Atualizar / Cadastrar Usuário (`updateUser`)** no Painel de Controle para associar cada `codinome` ao endereço real na Sepolia.
3. Inicie o frontend:
   ```bash
   cd hardhat-tutorial/frontend
   npm start
   ```
4. Acesse [http://localhost:3000](http://localhost:3000) no navegador.
