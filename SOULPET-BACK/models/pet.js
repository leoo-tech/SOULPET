import { connection } from '../config/database.js';
import { DataTypes } from 'sequelize';

// Colunas: nome (string), tipo (string), porte (string), dataNasc (dateonly)

export const Pet = connection.define('pet', {
  nome: {
    type: DataTypes.STRING(130),
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING(130),
    allowNull: false,
  },
  porte: {
    type: DataTypes.STRING(130),
    allowNull: false,
  },
  dataNasc: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

// Pet.sync(); // cria a tabela no banco de dados