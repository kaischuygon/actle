import { BsGithub, BsList } from "react-icons/bs";
import Modal from "../components/Modal";
import ThemeController from "../components/ThemeController";
import { FaInfo } from "react-icons/fa";
import games from "../assets/games.json"


const InfoModal = () => {
    return <Modal label="Info" icon={<FaInfo />}>
        <p>
            Games for film buffs and casual moviegoers alike. Inspired by <a href="https://www.nytimes.com/games/wordle/index.html" target="_blank" >wordle</a>, but for movies.
        </p>

        <p>
            Built with <a href="https://react.dev" target="_blank">React</a>, <a href="https://tailwindcss.com" target="_blank">Tailwind CSS</a> and <a href="https://daisyui.com" target="_blank">DaisyUI</a>.
        </p>
        <p>
            <span className="inline-flex gap-2 items-center prose">
                <BsGithub />
                <a href="https://github.com/kaischuygon/kino.wtf" target="_blank">source</a>
            </span>
        </p>
    </Modal>
}



export default function Navbar() {
    return (
        <nav className="flex justify-start items-center m-2 gap-2">
            <div>
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    {/* Page content here */}
                    <label htmlFor="my-drawer" className="btn drawer-button"><BsList /></label>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                        {/* Sidebar content here */}
                        {games.map(game => {
                            return <li>
                                <a href={game.link} className="flex gap-2">
                                    <div>
                                    {game.emoji} 
                                    </div>
                                    <div>
                                        {game.name}
                                    </div>
                                </a>
                            </li>
                        })}
                    </ul>
                </div>
            </div>
            <h1 className="text-2xl font-black">
                <span className="font-emoji">📼</span> Kino.wtf
            </h1>
            
            <div className="mx-auto" />

            <InfoModal />
            <ThemeController />
        </nav>
    )
}