import { BsList } from "react-icons/bs";
import ThemeController from "../components/ThemeController";
import games from "../assets/games.json";
import { useLocation } from "react-router-dom";
import InfoModal from "../components/modals/InfoModal";

const Navbar = () => {
    const activePath = useLocation().pathname;

    // Find the current game based on the active path
    const currentGame = games.find(game => game.link === activePath);

    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="drawer">
                    <input id="kino-drawer" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-content">
                        {/* Page content here */}
                        <label htmlFor="kino-drawer" className="btn btn-ghost drawer-button"><BsList /></label>
                    </div>
                    <div className="drawer-side z-50">
                        <label htmlFor="kino-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 gap-2">
                            <li>
                                <a href='/' className={`flex gap-2 text-xl ${activePath === '/' ? 'active' : ''}`}>
                                    <div className="font-emoji">📼</div>
                                    <div>Home</div>
                                </a>
                            </li>
                            {games.map(game => (
                                <li key={game.name}>
                                    <a href={game.link} className={`flex gap-2 text-xl ${activePath === game.link ? 'active' : ''}`}>
                                        <div className="font-emoji">{game.emoji}</div>
                                        <div>{game.name}</div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="navbar-center">
                <div className="text-xl">
                    <div className="breadcrumbs">
                        <ul>
                            <li>
                                <a href="/" className="btn btn-ghost !p-2 text-xl">Kino.wtf</a>
                            </li>
                            {currentGame && (
                                <li>
                                    <span className="font-emoji">{currentGame.emoji}</span> 
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="navbar-end gap-2">
                <InfoModal />
                <ThemeController />
            </div>
        </div>
    );
}

export default Navbar;
