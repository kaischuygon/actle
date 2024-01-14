import { createSignal } from "solid-js";
import CloseIcon from "~icons/bx/bx-x";

function Modal({ children, Icon, title }: { children:any , Icon?:any, title:string }) {
  const [isOpen, setIsOpen] = createSignal(false);

  const toggleModal = () => {
    setIsOpen(!isOpen());
  };

  return (
    <>
      {
      Icon ? 
        <button onClick={toggleModal}>
          <Icon class="text-lg" />
        </button> : <></>
      }

      {isOpen() && (
        <>
          <div class="absolute z-10 inset-0 bg-primary-950 opacity-75" onClick={toggleModal}></div>
          <div class="absolute z-10 inset-0 overflow-y-auto" aria-labelledby="info-modal" role="dialog" aria-modal="true">
            <div class="flex items-center justify-center min-h-screen" onClick={e => e.stopPropagation()}>
              <div class="inline-block bg-primary-800 rounded shadow-xl w-full md:w-1/3">
                <div class="flex justify-between items-center m-4">
                  <h3 class="text-lg font-semibold text-accent-400" id="info-modal">
                    {title}
                  </h3>
                  <button onClick={toggleModal} type="button" class="block">
                    <CloseIcon class="text-lg hover:brightness-90" />
                  </button>
                </div>

                <div class="m-4 prose prose-accent prose-invert">
                  {children}
                </div>
                
                <hr class="border-accent-400"/>
                
                <div class="flex text-sm text-primary-300 m-4 gap-2 justify-between">
                  <p>Made by <a target="_blank" href="https://kaischuyler.com">Kai Schuyler</a></p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Modal;