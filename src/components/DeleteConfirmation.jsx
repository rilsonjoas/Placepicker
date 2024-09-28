import { useEffect, useCallback } from "react";
import ProgressBar from "./ProgressBar";

const TIMER = 3000;

export default function DeleteConfirmation({ onConfirm, onCancel, open }) {
  
  const handleConfirm = useCallback(() => { 
    onConfirm();
  }, [onConfirm]); // useCallback to memoize handleConfirm

  useEffect(() => {
    let timer;
    if (open) {
      timer = setTimeout(handleConfirm, TIMER); // Use handleConfirm here
    } 

    return () => {
      clearTimeout(timer);
    };
  }, [open, handleConfirm]);

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
      <ProgressBar TIMER={TIMER} open={open} />
    </div>
  );
}
