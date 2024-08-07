import { Pet } from '../models/pet.js';
import { Cliente } from '../models/cliente.js';
import { Router } from 'express';

// criar um modulo de rotas para pets
export const petsRouter = Router();

// rota para listar todos os pets
petsRouter.get('/pets', async (req, res) => {
  // equivalente a SELECT * FROM pets;
  const listaPets = await Pet.findAll();
  res.json(listaPets);
});

// listando 1 pet
// Listagem de um pet específico (ID = ?)

petsRouter.get('/pets/:id', async (req, res) => {
  // SELECT * FROM pets WHERE id = 1;
  const petEncontrado = await Pet.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: Cliente,
        attributes: ['id', ['nome', 'dono']],
      },
    ],
  });

  if (petEncontrado) {
    res.json(petEncontrado);
  } else {
    res.status(404).json({ message: "Pet não encontrado!" });
  }
});

// inserindo um pet. se o pet estiver associado a um cliente, o clienteId deve ser informado. caso contrario, retorna erro ao inserir. o cliente deve estar cadastrado antes do pet

// Rota para adicionar um novo pet
petsRouter.post('/pets', async (req, res) => {
  try {
    const { nome, tipo, porte, dataNasc, clienteId } = req.body;

    const dataNascimento = dataNasc || null;

    // Verifica se o clienteId foi informado
    if (!clienteId) {
      return res.status(400).json({ message: 'O id do cliente deve ser informado!' });
    }

    // Verifica se o cliente existe
    const clienteDono = await Cliente.findByPk(clienteId);
    if (!clienteDono) {
      return res.status(404).json({ message: 'Cliente não encontrado!' });
    }

    // Cria um novo pet
    const pet = await Pet.create({ nome, tipo, porte, dataNasc: dataNascimento, clienteId });
    res.status(201).json({ message: 'Pet inserido com sucesso!', pet });

  } catch (err) {
    console.error(err);

    // Verifica o tipo de erro e responde adequadamente
    if (err.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: 'Erro ao inserir o pet!', errors: err.errors.map((e) => e.message) }); // retorna mensagens especificas de erro de
    }

    // erro genérico
    res.status(500).json({ message: 'Erro no servidor ao inserir o pet!', error: err });
  }
});

// apagar um pet
// DELETE FROM pets WHERE id = 1;

petsRouter.delete('/pets/:id', async (req, res) => {
  const idPet = req.params.id;

  try {
    const petDeletado = await Pet.findByPk(idPet);

    if (petDeletado) {
      await petDeletado.destroy();
      res.json({ message: 'eu sou inevitavel! *estalo*' });
    } else {
      res.status(404).json({ message: 'Pet não encontrado!' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao deletar o pet!', error: err });
  }
});


// atualizando dados do pet

petsRouter.put('/pets/:id', async (req, res) => {
  const idPet = req.params.id;
  const { nome, tipo, porte, dataNasc, clienteId } = req.body;

  try {
    const dataNascimento = dataNasc || null;
    const petAtualizado = await Pet.findByPk(idPet);

    if (petAtualizado) {
      await petAtualizado.update({
        nome,
        tipo,
        porte,
        dataNasc,
        clienteId,
      });

      const clienteDono = await Cliente.findByPk(clienteId, {
        attributes: ['id', ['nome', 'dono']],
      });

      res.json({ message: 'Pet atualizado com sucesso!', pet: { ...petAtualizado.toJSON(), cliente: clienteDono } });
    } else {
      res.status(404).json({ message: 'Pet não encontrado!' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar o pet!', error: err });
  }
});
