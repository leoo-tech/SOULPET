import { Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { getPet, updatePet } from "../api/pets";
import axios from "axios";

function EditarPet() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm();
  const [clientes, setClientes] = useState([]);

  const navigate = useNavigate();

  const { id } = useParams();

  function carregarClientes() {
    axios.get("http://localhost:3001/clientes").then((resposta) => {
      setClientes(resposta.data);
    });

  }

  useEffect(() => {
    carregarClientes();
  }, []);

  function atualizarPet(data) {
    updatePet(id, { ...data, clienteId: data.cliente })
      .then((resposta) => {
        toast.success(resposta.message);
        navigate("/pets");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }

  function carregarPet() {
    getPet(id).then((dados) => {
      const dataNascAjustada = new Date(dados.dataNasc).toISOString().split('T')[0];
      setValue("cliente", dados.cliente.id);
      reset({
        ...dados,
        dataNasc: dataNascAjustada,
      });
    }).catch((err) => {
      toast.error(err.response.data.message);
      navigate("/pets");
    });
  }
  useEffect(() => {
    carregarPet();
  }, []);

  return (
    <main className="mt-4 container">
      <h1>Editar pet</h1>
      <hr />
      <form onSubmit={handleSubmit(atualizarPet)}>
        <div>
          <label htmlFor="nome">Nome</label>
          <input
            type="text"
            id="nome"
            className="form-control"
            {...register("nome", { required: true, maxLength: 200 })}
          />
          {errors.nome && (
            <small className="text-danger">O nome é inválido!</small>
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
            <small className="text-danger">O tipo é inválido!</small>
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
            <small className="text-danger">O porte é inválido!</small>
          )}
        </div>
        <div>
          <label htmlFor="cliente">Dono</label>
          <select
            id="cliente"
            className="form-control"
            {...register("cliente", { required: true })}
          >
            <option value="">Selecione um dono</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
          {errors.cliente && (
            <small className="text-danger">O dono é inválido!</small>
          )}
        </div>
        <div>
          <label htmlFor="dataNasc">Data de Nascimento</label>
          <input
            type="date"
            id="dataNasc"
            className="form-control"
            {...register("dataNasc", { required: true })}
          />
          {errors.dataNasc && (
            <small className="text-danger">A data de nascimento é inválida!</small>
          )}
        </div>
        <div>
          <Button type="submit">Atualizar</Button>
        </div>
      </form>
    </main >
  );
}

export default EditarPet;
