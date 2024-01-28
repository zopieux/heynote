import { join } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import license from 'rollup-plugin-license'
import pkg from './package.json'
import path from 'path'

import { keyHelpStr } from "./shared-utils/key-helper";

const updateReadmeKeybinds = async () => {
	const fs = require('fs')
	const path = require('path')
	const readmePath = path.resolve(__dirname, 'README.md')
	let readme = fs.readFileSync(readmePath, 'utf-8')
	const keybindsRegex = /^(### What are the default keyboard shortcuts\?\s*).*?^(```\s+#)/gms
	const shortcuts = `$1**On Mac**

\`\`\`
${keyHelpStr('darwin')}
\`\`\`

**On Windows and Linux**

\`\`\`
${keyHelpStr('win32')}
$2`

	readme = readme.replace(keybindsRegex, shortcuts)
	fs.writeFileSync(readmePath, readme)
}

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
        alias: {
            '@': path.resolve(__dirname),
        },
    },

	plugins: [
		vue(),
		updateReadmeKeybinds(),
		// Add license header to the built files
		license({thirdParty: {
			output: join(__dirname, 'dist', 'dependencies.txt'),
			includePrivate: true, // Default is false.
		  },
		})
	],
	css: {
		preprocessorOptions: {
			sass: {
				additionalData: `
    @import "./src/css/include.sass"
`
			}
		}
	},
	server: !!process.env.VSCODE_DEBUG ? (() => {
		const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL)
		return {
			host: url.hostname,
			port: +url.port,
		}
	})() : undefined,
	clearScreen: false,
})
