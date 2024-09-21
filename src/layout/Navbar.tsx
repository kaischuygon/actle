import React, { ReactNode } from "react";
import { BsList } from "react-icons/bs";
import ThemeController from "../components/ThemeController";
import games from "../assets/games.json";
import { useLocation } from "react-router-dom";
import InfoModal from "../components/modals/InfoModal";

interface NavbarProps {
    modals?: ReactNode[];
}

const Navbar: React.FC<NavbarProps> = ({ modals = [] }) => {
    const active = useLocation().pathname;
    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost">
                        <BsList />
                    </div>
                    <ul tabIndex={0} className="menu menu-sm rounded-btn dropdown-content bg-base-200 z-50 mt-3 w-52 p-2 shadow">
                        <li>
                            <a href='/' className={`flex gap-2 text-xl ${active === '/' ? 'active' : ''}`}>
                                <div>📼</div>
                                <div>Home</div>
                            </a>
                        </li>
                        {games.map(game => (
                            <li key={game.name}>
                                <a href={game.link} className={`flex gap-2 text-xl ${active === game.link ? 'active' : ''}`}>
                                    <div>{game.emoji}</div>
                                    <div>{game.name}</div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="navbar-center">
                <a className="btn btn-ghost text-xl" href="/">
                    <span className="font-emoji">📼</span> Kino.wtf
                </a>
            </div>
            <div className="navbar-end gap-2">
                {modals.map((modal, index) => (
                    <React.Fragment key={index}>{modal}</React.Fragment>
                ))}
                <InfoModal key="infoModal" />
                <ThemeController />
            </div>
        </div>
    );
}

export default Navbar;