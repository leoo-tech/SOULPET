import { Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getPets, deletePet } from "../api/pets";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

function Pets() {
  const [pets, setPets] = useState(null); // começar com null mostra que a requisição ainda não foi feita

  function carregarPets() {
    getPets().then((dados) => {
      setPets(dados);
    });
  }

  function deletarPet(id) {
    const deletar = window.confirm("Deseja realmente excluir este pet?");
    if (deletar) {
      deletePet(id).then((resposta) => {
        toast.success(resposta.message);
        carregarPets();
      });
    }
  }

  useEffect(() => {
    carregarPets();
  }, []);

  function formatarData(dataString) {
    // criando um objeto date javascript a partir da string
    const data = new Date(dataString);
    // obtendo a diferença de fuso horário em minutos. O método getTimezoneOffset() retorna a diferença entre o horário local e o UTC em minutos.
    const diferencaFusoHorario = data.getTimezoneOffset();
    // Ajusta a data para o fuso horário local, adicionando a diferença do fuso horário.
    // 'getTime' retorna o tempo em milissegundos desde o Unix Epoch (1 de janeiro de 1970).
    // A diferença do fuso horário é convertida de minutos para milissegundos (multiplicada por 60 * 1000).
    const dataAjustada = new Date(data.getTime() + (diferencaFusoHorario * 60 * 1000));
    return dataAjustada.toLocaleDateString();
  }

  return (
    <main className="mt-4 container">
      <h1>Pets</h1>

      <Button as={Link} to="/pets/novo">
        Adicionar pet
      </Button>
      <hr />

      {pets === null ? (
        <Loader />
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Porte</th>
              <th>Nascimento</th>
              <th>Dono</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet) => (
              <tr key={pet.id}>
                <td>{pet.nome}</td>
                <td>{pet.tipo}</td>
                <td>{pet.porte}</td>
                <td>{pet.dataNasc ? formatarData(pet.dataNasc) : 'Não informada'}</td>
                <td>{pet.cliente.nome}</td>
                <td>
                  <Button as={Link} to={`/pets/editar/${pet.id}`} size='sm' className='me-2 mt-2'>
                    Editar
                  </Button>
                  <Button
                    onClick={() => deletarPet(pet.id)}
                    variant="danger" className="me-2 mt-2" size='sm'>
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )
      }

    </main >
  );
}

export default Pets;
