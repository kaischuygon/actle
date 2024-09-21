import React, { ReactNode } from "react"
import Navbar from "../layout/Navbar"
import Footer from "../layout/Footer"

interface LayoutProps {
    children: ReactNode;
    modals?: ReactNode[];
}

const Layout: React.FC<LayoutProps> = ({ modals, children }) => {
    return (
        <div className="max-w-screen-sm mx-auto grid grid-rows-[0fr_1fr_0fr] min-h-screen">
            <div className="border-xb">
                <Navbar modals={modals} />
            </div>
            <div className="border-xb flex flex-col gap-2 p-2">
                {children}
            </div>
            <div className="border-xb flex gap-2 justify-center items-center p-2">
                <Footer />
            </div>
        </div>
    )
}

export default Layout;