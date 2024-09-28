import { useRef, useState, useEffect, useCallback } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || []; //O método JSON.parse converte uma string em um array. Se não houver nada no local storage, ele retorna um array vazio.
const storedPlaces = storedIds.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
); //Mapeia os ids dos lugares selecionados e retorna os lugares correspondentes.

function App() {
  const selectedPlace = useRef();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [availablePlaces, setAvaliablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlace = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );

      setAvaliablePlaces(sortedPlace);
    });
  }, []); //O useEffect faz com que a função dentro dele seja executada apenas uma vez, quando o componente é montado. Nesse caso, ele pega a localização do usuário e ordena os lugares disponíveis por distância.

  function handleStartRemovePlace(id) {
   setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
   setModalIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || []; //O método JSON.parse converte uma string em um array. Se não houver nada no local storage, ele retorna um array vazio.
    if (storedIds.indexOf(id) === -1) {
      //Checa se o id do lugar selecionado já está no local storage. Se não estiver, ele adiciona o id do lugar selecionado no local storage.
      localStorage.setItem(
        "selectedPlaces",
        JSON.stringify([id, ...storedIds])
      ); //Guarda o id do lugar selecionado no local storage, que fica salvo no navegador. Nesse caso ele guarda o id do lugar selecionado e os ids dos lugares selecionados anteriormente.
    }
  }

  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModalIsOpen(false);

    const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) || [];
    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
    ); //Remove o id do lugar selecionado do local storage.
  }, []);

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
          open={modalIsOpen} //O modalIsOpen é passado para o componente DeleteConfirmation para que ele saiba se o modal está aberto ou fechado.
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting places by distance..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
