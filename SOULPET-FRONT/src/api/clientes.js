// este arquivo possui funções para realizar as operações do CRUD de clientes
import axios from 'axios';

// C - create
export async function addCliente(data) {
  // segundo parametro do post é o corpo da requisição
  const response = await axios.post('http://localhost:3001/clientes', data);
  return response.data;
}

// R - read
export async function getClientes() {
  const response = await axios.get('http://localhost:3001/clientes');
  // aqui no data está o JSON de resposta do backend
  return response.data;
}

export async function getCliente(id) {
  const response = await axios.get(`http://localhost:3001/clientes/${id}`);
  return response.data;
}

// U - update
export async function updateCliente(id, data) {
  const response = await axios.put(`http://localhost:3001/clientes/${id}`, data);
  return response.data;
}

// D - delete
export async function deleteCliente(id) {
  const response = await axios.delete(`http://localhost:3001/clientes/${id}`);
  return response.data;
}