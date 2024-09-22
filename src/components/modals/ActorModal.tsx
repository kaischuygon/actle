import { BsBook } from "react-icons/bs";
import Modal from "../Modal";

const ActorModal = () => {
    return (
        <Modal label="How to Play" icon={<BsBook />}>
            <p>
                Each day a new actor is available to guess. Hints are given based on the top 6 most popular movies (in reverse order) in their filmography, as well as other trivia: birthdate, gender and birthplace.
            </p>
        </Modal>
    );
}

export default ActorModal;