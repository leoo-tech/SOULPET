
import { config } from 'dotenv';
config(); // Load environment variables from .env file. carrega as variaveis do env para a nossa aplicação

import { Sequelize } from 'sequelize';

// objeto usado na conexao com o banco de dados
export const connection = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);

export async function authenticate(connection) {
  // tentando a conexão com o banco de dados mysql
  try {
    await connection.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database: ', error);
  }
}