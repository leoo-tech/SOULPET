import { Cliente } from '../models/cliente.js';
import { Endereco } from '../models/endereco.js';
import { Router } from 'express';

// criar um modulo de rotas para clientes
export const clientesRouter = Router();

// rota para listar todos os clientes
clientesRouter.get('/clientes', async (req, res) => {
  // equivalente a SELECT * FROM clientes;
  const listaClientes = await Cliente.findAll();
  res.json(listaClientes);
});

// listando 1 cliente
// Listagem de um cliente específico (ID = ?)
// :id => parâmetro de rota
clientesRouter.get('/clientes/:id', async (req, res) => {
  // SELECT * FROM clientes WHERE id = 1;
  const clienteEncontrado = await Cliente.findOne({
    where: { id: req.params.id },
    include: [Endereco],
  });

  if (clienteEncontrado) {
    res.json(clienteEncontrado);
  } else {
    res.status(404).json({ message: "Cliente não encontrado!" });
  }
});

// rota para inserir um cliente
clientesRouter.post('/clientes', async (req, res) => {
  // extraindo os dados do body que serao usados na inserção
  const { nome, email, telefone, endereco } = req.body;

  try {
    // tentativa de inserir o cliente
    await Cliente.create({
      nome,
      email,
      telefone,
      endereco,
    },
      { include: [Endereco] } // indicando que o endereço será salvo e associado ao cliente
    );
    res.status(201).json({ message: 'Cliente inserido com sucesso!' });

  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Erro ao inserir o cliente!' }); // erro do lado do cliente

    // 500 - erro do lado do servidor
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor ao inserir o cliente!' }); // erro do lado do servidor

  }

});

// rota para atualizar um cliente
clientesRouter.put('/clientes/:id', async (req, res) => {
  const idCliente = req.params.id;
  const { nome, email, telefone, endereco } = req.body;

  try {
    const clienteAtualizado = await Cliente.findOne({ where: { id: idCliente } });

    if (clienteAtualizado) {
      // atualiza a linha do endereço que for o id do cliente
      // for igual ao do cliente sendo atualizado
      await Endereco.update(endereco, { where: { clienteId: idCliente } });
      await clienteAtualizado.update({
        nome,
        email,
        telefone,
      });

      res.json({ message: 'Cliente atualizado com sucesso!' });
    } else {
      res.status(404).json({ message: 'Cliente não encontrado!' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar o cliente!', error: err });
  }
});

// rota para deletar um cliente
clientesRouter.delete('/clientes/:id', async (req, res) => {
  const idCliente = req.params.id;

  try {
    const clienteDeletado = await Cliente.findOne({ where: { id: idCliente } });

    if (clienteDeletado) {
      await clienteDeletado.destroy();
      res.json({ message: 'eu sou inevitavel! *estalo*' });
    } else {
      res.status(404).json({ message: 'Cliente não encontrado!' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao deletar o cliente!', error: err });
  }
});
