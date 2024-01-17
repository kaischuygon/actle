import { createSignal } from "solid-js";
import CloseIcon from "~icons/bx/bx-x";
// @ts-ignore
import clickOutside from "./click-outside";

function Modal({ children, Icon, title }: { children:any , Icon?:any, title:string }) {
  const [show, setShow] = createSignal(false);
  
  return (
      <>
      {
      Icon ? 
        <button onClick={() => setShow(true)}>
          <Icon class="text-lg" />
        </button> : <></>
      }

      {show() && (
        <>
          <div class="absolute z-10 inset-0 bg-primary-950 opacity-75"></div>
          <div class="absolute z-10 inset-0 overflow-y-auto" aria-labelledby="info-modal" role="dialog" aria-modal="true" use:clickOutside={() => setShow(false)}>
            <div class="flex items-center justify-center min-h-screen">
              <div class="inline-block bg-primary-800 rounded shadow-xl w-full md:w-1/3">
                <div class="flex justify-between items-center m-4">
                  <h3 class="text-lg font-semibold text-accent-400" id="info-modal">
                    <Icon class="inline"/> {title}
                  </h3>
                  <button onClick={() => setShow(false)} type="button" class="block">
                    <CloseIcon class="text-lg hover:brightness-90" />
                  </button>
                </div>

                <div class="m-4 prose prose-accent prose-invert">
                  {children}
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