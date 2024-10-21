import React from "react"
import { BsGithub } from "react-icons/bs"

export default function Footer() {
    const footer = [
        <span className="inline-flex gap-2">
          © 2024
          <a href="https://kaischuyler.com" target="_blank" className="link">Kai Schuyler Gonzalez</a>
        </span>,
        <span className="inline-flex gap-2 items-center">
          <span className="font-emoji">☕️</span>
          <a className="link" href="https://www.buymeacoffee.com/kaischuyler" target="_blank">buy me a coffee</a>
        </span>,
        <span className="inline-flex gap-2 items-center">
          <BsGithub />
          <a className="link" href="https://github.com/kaischuygon/kino.wtf" target="_blank">source</a>
        </span>,
        <span className="inline-flex gap-2 items-center">
          <a className="link" href="https://github.com/kaischuygon/kino.wtf/issues" target="_blank">issues?</a>
        </span>
    ]

    return (
        footer.map((footerObj, i) => {
            return <React.Fragment key={i}>
                {footerObj}
                {i < footer.length - 1 && ' • '}
            </React.Fragment>
        })
    )
}