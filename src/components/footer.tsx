import GitHubIcon from "~icons/bx/bxl-github"

export default () => {
    return (
      <div class="flex flex-wrap text-xs text-primary-300 m-2 gap-2 justify-center">
        <p>© 2024 <a target="_blank" href="https://kaischuyler.com">Kai Schuyler</a></p>
        <span>·</span>
        <span>
          <span>☕️ </span>
          <a href="https://www.buymeacoffee.com/kaischuyler" target="_blank">
            Buy me a coffee
          </a>
        </span>
        <span>·</span>
        <span class="inline">
          <GitHubIcon class="text-primary-100 inline mr-1" />
          <a target="_blank" href="https://github.com/kaischuygon/kino.wtf">
            source
          </a>
        </span>
        <span>·</span>
        <span class="inline">
          <a target="_blank" href="https://github.com/kaischuygon/kino.wtf/issues">
            issues?
          </a>
        </span>
      </div>
    )
  }