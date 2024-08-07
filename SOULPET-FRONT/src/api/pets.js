// este arquivo possui funções para realizar as operações do CRUD de Pets
import axios from 'axios';

const API_URL = 'http://localhost:3001/pets';

// C - create
export async function addPet(data) {
  try {
    // Primeiro, verifique se o clienteId está presente no corpo da requisição
    if (!data.clienteId) {
      throw new Error('clienteId é obrigatório!');
    }

    // Em seguida, verifique se o cliente existe antes de criar o pet
    const clienteResponse = await axios.get(`http://localhost:3001/clientes/${data.clienteId}`);
    if (!clienteResponse.data) {
      throw new Error('Cliente não encontrado!');
    }

    // Agora, crie o pet
    const response = await axios.post('http://localhost:3001/pets', data);
    const newPet = response.data;

    // Retorne o pet criado junto com os detalhes do cliente
    return { ...newPet, cliente: clienteResponse.data };
  } catch (error) {
    // Lida com erros e retorna uma mensagem adequada
    console.error(error);
    throw error; // Propaga o erro para ser tratado no front-end
  }
}
// R - read
export async function getPets() {
  const response = await axios.get(`${API_URL}`);
  // aqui no data está o JSON de resposta do backend
  const pets = response.data;

  // Para cada pet, buscar os dados do cliente associado
  const petsComClientes = await Promise.all(pets.map(async (pet) => {
    const clienteResponse = await axios.get(`http://localhost:3001/clientes/${pet.clienteId}`);
    const cliente = clienteResponse.data;
    return { ...pet, cliente };

  }));
  return petsComClientes;
}

export async function getPet(id) {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
}

// U - update
export async function updatePet(id, data) {
  const response = await axios.put(`${API_URL}/${id}`, data);
  const updatedPet = response.data;

  // Buscar os dados do cliente associado ao pet atualizado. chave estrangeira de Cliente
  const clienteResponse = await axios.get(`http://localhost:3001/clientes/${data.clienteId}`);
  const cliente = clienteResponse.data;

  // Retornar o pet atualizado com os dados do cliente
  return { ...updatedPet, cliente };
}

// D - delete
export async function deletePet(id) {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
}