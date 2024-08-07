import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getClientes, deleteCliente } from "../api/clientes";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

function Clientes() {
  const [clientes, setClientes] = useState(null);

  function carregarClientes() {
    getClientes().then((dados) => {
      console.log(dados);
      setClientes(dados);
    });
  }



  function deletarCliente(id) {
    const deletar = window.confirm("Deseja realmente excluir este cliente?");
    if (deletar) {
      deleteCliente(id).then((resposta) => {
        toast.success(resposta.message);
        carregarClientes();
      });
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  return (
    <main className="mt-4 container">
      <h1>Clientes</h1>

      <Button as={Link} to="/clientes/novo">
        Adicionar Cliente
      </Button>
      <hr />

      {clientes === null ? (
        <Loader />
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nome}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefone}</td>
                <td>
                  <Button as={Link} to={`/clientes/editar/${cliente.id}`} size='sm'>
                    Editar
                  </Button>
                  <Button
                    onClick={() => deletarCliente(cliente.id)}
                    variant="danger" className="ms-2" size='sm'>
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
      }

    </main >
  );
}

export default Clientes;
