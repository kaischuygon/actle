import { useEffect } from "react";
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

    useEffect(() => {
        themeChange(false)
        // 👆 false parameter is required for react project
      }, [])

    return (
        <div className="">
            <select className="select select-accent" data-choose-theme>
                {themes.map(theme => {
                    return <option key={theme} aria-label={theme} value={theme}>
                        {theme}
                    </option>
                })}
            </select>
        </div>
    );
}
