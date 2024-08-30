import { ReactNode } from "react"
import { marked } from "marked"

type Props = ({
    "label": string,
    "icon": ReactNode,
    "markdown": string
})

export default function Modal({ label, icon, markdown }: Props) {
    console.log(marked(markdown))

    return (
        <>
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <button className="btn" onClick={() => (document.getElementById(`${label}-modal`) as HTMLDialogElement).showModal()}>{icon}</button>
            <dialog id={`${label}-modal`} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box prose">
                    <div className="flex items-center gap-2">
                        {icon}
                        <span className="text-2xl">{label}</span>
                    </div>

                    {markdown}

                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    )
}