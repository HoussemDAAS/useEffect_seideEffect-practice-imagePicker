import { useEffect, useState } from "react";

export default function DeleteConfirmation({ onConfirm, onCancel }) {
const [remaining, setRemaining] = useState(5000);

useEffect(() => {
  const timer= setInterval(() => {
    setRemaining((prevRemaining) => prevRemaining - 10);
  },10)
  return () => {
    clearInterval(timer);
  }
})


  useEffect(() => {
   const timer= setTimeout(() => {
      onConfirm();
    }, 5000);
    return () => {
      clearTimeout(timer);
    }
  },[onConfirm])

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <progress value={remaining} max={5000}/>
    </div>
  );
}
