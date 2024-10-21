import React, { useEffect, useState } from "react";
import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";
import { themeChange } from 'theme-change'
import { getPreferredTheme } from "../helpers/getPreferredTheme";

export type Theme = string;

interface ThemePreviewProps {
  theme: Theme;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ theme }) => (
  <div
    className="border-2 border-base-300 hover:border-primary hover:brightness-75 overflow-hidden rounded-btn outline outline-2 outline-offset-2 outline-transparent font-sans"
    data-set-theme={theme}
    data-act-class="!outline-secondary"
  >
    <div
      data-theme={theme}
      className="bg-base-100 text-base-content w-full cursor-pointer"
    >
      <div className="grid grid-cols-5 grid-rows-3">
        <div className="bg-base-200 col-start-1 row-span-2 row-start-1"/>
        <div className="bg-base-300 col-start-1 row-start-3"/>
        <div
          className="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2"
        >
          <span className="font-bold">{theme}</span>
          <div className="flex flex-wrap gap-1">
            {[('primary'), 'secondary', 'accent', 'neutral'].map((color) => (
              <div
                key={color}
                className={`bg-${color} flex aspect-square w-5 items-center justify-center rounded-btn lg:w-6`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ThemeController: React.FC = () => {
    const themes: Theme[] = [
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
    ];

    const [currentTheme, setCurrentTheme] = useState<Theme>(getPreferredTheme(themes));
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        themeChange(false);
        // 👆 false parameter is required for react project
    }, []);

    const toggleDropdown = (): void => {
        setIsOpen(!isOpen);
    };

    const handleThemeChange = (theme: Theme): void => {
        setCurrentTheme(theme);
        setIsOpen(false);
        localStorage.setItem('theme', theme);
    };

    return (
        <div className="dropdown dropdown-end">
            <div 
                tabIndex={0} 
                role="button" 
                className="btn"
                onClick={toggleDropdown}
            >
                <span className="text-ellipsis overflow-hidden w-[4em] text-sm">{currentTheme}</span>
                {isOpen ? <BsCaretUpFill /> : <BsCaretDownFill />}
            </div>
            <ul tabIndex={0} className={`mt-4 dropdown-content rounded-btn bg-base-300 z-50 w-52 p-2 shadow max-h-96 overflow-auto ${isOpen ? '' : 'hidden'}`}>
                <div className="rounded-box grid gap-2">
                    {themes.map((theme) => (
                        <div key={theme} onClick={() => handleThemeChange(theme)}>
                            <ThemePreview theme={theme} />
                        </div>
                    ))}
                </div>
            </ul>
        </div>
    );
};

export default ThemeController;