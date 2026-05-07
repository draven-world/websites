import type { Config } from 'tailwindcss'
import sharedConfig from '@draven/tailwind-config'
import typography from '@tailwindcss/typography'

const config: Config = {
  presets: [sharedConfig],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  plugins: [typography],
}

export default config
