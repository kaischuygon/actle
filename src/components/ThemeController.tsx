import { useEffect, useState } from "react";
import { BsCaretDownFill } from "react-icons/bs";
import { themeChange } from 'theme-change'

export default function ThemeController() {
    
    const themes = [
        "light",
        "dark",
        "cupcake",
        "bumblebee",
        "emerald",
        "corporate",
        "synthwave",
        "retro",
        "cyberpunk",
        "valentine",
        "halloween",
        "garden",
        "forest",
        "aqua",
        "lofi",
        "pastel",
        "fantasy",
        "wireframe",
        "black",
        "luxury",
        "dracula",
        "cmyk",
        "autumn",
        "business",
        "acid",
        "lemonade",
        "night",
        "coffee",
        "winter",
        "dim",
        "nord",
        "sunset",
    ]

    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('theme') || document.documentElement.getAttribute('data-theme'))


    useEffect(() => {
        themeChange(false)
        // 👆 false parameter is required for react project
    }, [])

    return (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn m-1">
                <span className="truncate w-[4em]" >{currentTheme}</span>
                <BsCaretDownFill />
            </div>
            <ul tabIndex={0} className="dropdown-content rounded-btn bg-base-200 z-50 w-52 p-2 shadow max-h-96 overflow-auto">
                {themes.map(theme => {
                    return <li key={theme} aria-label={theme} value={theme}>
                        <input
                            type="radio"
                            name="theme-dropdown"
                            className={`theme-controller btn btn-sm btn-block btn-ghost justify-start`}
                            aria-label={theme}
                            value={theme} data-set-theme={theme} onClick={() => setCurrentTheme(theme)}/>
                    </li>
                })}
            </ul>
        </div>
    );
}
