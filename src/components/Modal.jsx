import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

function Modal({ open, children, onClose }) {
  const dialog = useRef();

  useEffect(() => {
    if (open) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open]); //O useEffect faz com que a função dentro dele seja executada toda vez que a propriedade open mudar. Nesse caso, ele abre ou fecha o modal. O open é uma dependência necessária para o useEffect funcionar. As dependências com o useEffect são usadas para que o useEffect seja executado toda vez que a dependência mudar.

  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onClose}>
      {children}
    </dialog>,
    document.getElementById('modal')
  );
};

export default Modal;
