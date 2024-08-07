import { connection, authenticate } from './config/database.js';
import express from 'express';
import { clientesRouter } from './routes/clientes.js';	// importar o módulo de rotas de clientes
import { petsRouter } from './routes/pets.js';	// importar o módulo de rotas de pets
import Cors from 'cors';

authenticate(connection).then(() => {
  // apos conectar no banco de dados, sincroniza os modelos. gera as tabelas se necessario
  // force: true força a criação da tabela, apagando a tabela se ela existir
  // recomendado apenas no desenvolvimento
  // connection.sync({ force: true });
  connection.sync();
});

// definir a aplicação backend em express
// recursos pré-configurados para facilitar o desenvolvimento
const app = express();

app.use(express.json()); // middleware para interpretar o corpo das requisições como JSON

//Cors - em origin, colocar o endereço do front-end
app.use(Cors({
  origin: 'http://localhost:5173'
}));

// definir as rotas da aplicação
app.use(clientesRouter); // roteador de clientes
app.use(petsRouter); // roteador de pets

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001 em http://localhost:3001');
});
