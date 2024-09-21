import Modal from "../Modal";
import { FaInfo } from "react-icons/fa";
import { BsGithub } from "react-icons/bs";

const InfoModal = () => {
    return (
        <Modal label="Info" icon={<FaInfo />}>
            <p>
                Games for film buffs and casual moviegoers alike. Inspired by <a href="https://www.nytimes.com/games/wordle/index.html" target="_blank" rel="noopener noreferrer">wordle</a>, but for movies.
            </p>
            <p>
                Built with <a href="https://react.dev" target="_blank" rel="noopener noreferrer">React</a>, <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer">Tailwind CSS</a> and <a href="https://daisyui.com" target="_blank" rel="noopener noreferrer">DaisyUI</a>.
            </p>
            <p>
                <span className="inline-flex gap-2 items-center prose">
                    <BsGithub />
                    <a href="https://github.com/kaischuygon/kino.wtf" target="_blank" rel="noopener noreferrer">source</a>
                </span>
            </p>
        </Modal>
    );
}

export default InfoModal;