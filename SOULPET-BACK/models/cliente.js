// Modelo para gerar a tabela de clientes no MySQL
// Mapeamento: cada propriedade que definimos vira uma coluna da tabela

import { connection } from '../config/database.js';
import { DataTypes } from 'sequelize';
import { Endereco } from './endereco.js';
import { Pet } from './pet.js';

// obs: o sequelize cria automaticamente a coluna id como chave primaria e auto incremento
export const Cliente = connection.define('cliente', {
  // configurando a coluna nome
  nome: { // nome do cliente VARCHAR(130) NOT NULL
    type: DataTypes.STRING(130), //coluna nome como varchar
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING, // por padrao o sequelize cria varchar(255)
    allowNull: false,
    unique: true, // valor unico
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// assoicação 1:1 (cliente tem um Endereco)
Cliente.hasOne(Endereco, { onDelete: "CASCADE" }); // um cliente tem um Endereco
Endereco.belongsTo(Cliente); // um Endereco pertence a um cliente
// endereço tem uma chave estrangeira chamada clienteId

// obs: o sequelize.sync() cria a tabela no banco de dados
// cliente.sync(); // cria a tabela no banco de dados

// assoiação 1:N (cliente tem muitos pets)
Cliente.hasMany(Pet, {onDelete: "CASCADE" }); // um cliente tem muitos pets
Pet.belongsTo(Cliente); // um pet pertence a um cliente
// pet tem uma chave estrangeira chamada clienteId

// cliente = model = gerenciar a tabela de clientes

// cliente.findAll() // retorna todos os clientes
// cliente.findByPk(1) // retorna o cliente com id 1
// cliente.update(novosDados) // atualiza um cliente
// cliente.destroy() // deleta um cliente
// cliente.findOne({ where: { nome: 'Fulano' } }) // retorna o primeiro cliente com nome Fulano