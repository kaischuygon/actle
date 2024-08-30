import Modal from "../components/Modal";
import ThemeController from "../components/ThemeController";
import { FaInfo } from "react-icons/fa";

const InfoModal = () => {
    return <Modal
        label="Info"
        icon={<FaInfo />}
        markdown={''}
    />
}



export default function Navbar() {
    return (
        <nav className="flex justify-end items-center m-2 gap-2">
            <h1 className="text-2xl font-black mr-auto">
                <span className="font-emoji">📼</span> Kino.wtf
            </h1>

            <InfoModal />

            <ThemeController />
        </nav>
    )
}