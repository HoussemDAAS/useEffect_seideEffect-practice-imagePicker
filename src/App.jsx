import { useRef, useState, useEffect } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

const storeIds = JSON.parse(localStorage.getItem("SelectedPlaces")) || [];
const  storedPlaces= storeIds.map((id) => AVAILABLE_PLACES.find((place) => place.id === id));
function App() {
const [isOpen, setIsOpen] = useState(false);
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
  const [AvailablePlaces, setAvailablePlaces] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((postion) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        postion.coords.latitude,
        postion.coords.longitude
      );
      setAvailablePlaces(sortedPlaces);
    });
  }, []);
  function handleStartRemovePlace(id) {
  setIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });
    const storeIds = JSON.parse(localStorage.getItem("SelectedPlaces")) || [];
    if (storeIds.indexOf(id) === -1) {
      localStorage.setItem("SelectedPlaces", JSON.stringify([...storeIds, id]));
    }
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
setIsOpen(false);
    const storeIds = JSON.parse(localStorage.getItem("SelectedPlaces")) || [];
    localStorage.setItem(
      "SelectedPlaces",
      JSON.stringify(storeIds.filter((id) => id !== selectedPlace.current))
    );
  }

  return (
    <>
      <Modal open={isOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
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
          fallbackText={"loading places according to your location...."}
          places={AvailablePlaces}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
