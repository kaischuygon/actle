import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import Icons from 'unplugin-icons/vite'

export default defineConfig({
  plugins: [solid(), Icons({ compiler: 'solid' })],
})
