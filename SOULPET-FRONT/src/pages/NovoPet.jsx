import { Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { addPet } from "../api/pets";
import axios from "axios";

function NovoPet() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [clientes, setClientes] = useState([]);

  const navigate = useNavigate();

  function carregarClientes() {
    axios.get("http://localhost:3001/clientes").then((resposta) => {
      setClientes(resposta.data);
    });
  }

  useEffect(() => {
    carregarClientes();
  }, []);


  function adicionarPet(data) {
    if (data.dataNasc === '') data.dataNasc = null;
    const petData = {
      ...data,
      clienteId: data.cliente,
    }
    addPet(petData)
      .then((resposta) => {
        toast.success(resposta.message);
        navigate("/pets");
      })
      .catch((err) => {
        toast.error('Erro ao adicionar pet: ' + err.response?.data?.message || err.message);
      });
  }

  return (
    <main className="mt-4 container">
      <h1>Adicionar novo pet</h1>
      <hr />
      <form onSubmit={handleSubmit(adicionarPet)}>
        <div>
          <label htmlFor="nome">Nome</label>
          <input
            type="text"
            id="nome"
            className="form-control"
            {...register("nome", { required: true, maxLength: 200 })}
          />
          {errors.nome && (
            <small className="text-danger">O nome é obrigatório e deve ter no máximo 200 caracteres.</small>
          )}
        </div>
        <div>
          <label htmlFor="tipo">Tipo</label>
          <input
            type="text"
            id="tipo"
            className="form-control"
            {...register("tipo", { required: true, maxLength: 200 })}
          />
          {errors.tipo && (
            <small className="text-danger">O tipo é obrigatório e deve ter no máximo 200 caracteres.</small>
          )}
        </div>
        <div>
          <label htmlFor="porte">Porte</label>
          <input
            type="text"
            id="porte"
            className="form-control"
            {...register("porte", { required: true, maxLength: 200 })}
          />
          {errors.porte && (
            <small className="text-danger">O porte é obrigatório e deve ter no máximo 200 caracteres.</small>
          )}
        </div>
        <div>
          <label htmlFor="cliente">Dono</label>
          <select
            id="cliente"
            className="form-control"
            {...register("cliente", { required: true })}
          >
            < option selected disabled>Selecione um dono</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome} - {cliente.email}
              </option>
            ))}
          </select>
          {errors.cliente && (
            <small className="text-danger">Selecionar um dono é obrigatório.</small>
          )}
        </div>
        <div>
          <label htmlFor="dataNasc">Data de Nascimento</label>
          <input
            type="date"
            id="dataNasc"
            className="form-control"
            {...register("dataNasc")}
          />
          {errors.dataNasc && (
            <small className="text-danger">A data de nascimento é inválida.</small>
          )}
        </div>
        <div>
          <Button className="mt-3" type="submit">Adicionar</Button>
        </div>
      </form>
    </main>
  );
}

export default NovoPet;
