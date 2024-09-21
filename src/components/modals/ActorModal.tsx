import { BsBookFill } from "react-icons/bs";
import Modal from "../Modal";

const ActorModal = () => {
    return (
        <Modal label="How to Play" icon={<BsBookFill />}>
            <p>
                Each day a new movie is chosen from a curated list. Hints are given based on the top 6 billed actors (in reverse order), as well as other trivia: release year, director(s) and genre.
            </p>
        </Modal>
    );
}

export default ActorModal;