import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const rawDir = path.resolve(import.meta.dirname, '../src/pages/_raw')
const stylesDir = path.resolve(import.meta.dirname, '../src/styles')

const pages = [
  { name: 'Dashboard', file: 'Dashboard.raw.tsx', css: 'kombai-dashboard.css', scope: 'page-dashboard' },
  { name: 'Routes', file: 'Routes.raw.tsx', css: 'kombai-routes.css', scope: 'page-routes' },
  { name: 'Alerts', file: 'Alerts.raw.tsx', css: 'kombai-alerts.css', scope: 'page-alerts' },
  { name: 'Analytics', file: 'Analytics.raw.tsx', css: 'kombai-analytics.css', scope: 'page-analytics' },
]

function extractCssClasses(css) {
  const classes = new Set()
  const regex = /\.([a-zA-Z0-9_-]+)/g
  let match
  while ((match = regex.exec(css)) !== null) {
    classes.add(match[1])
  }
  return classes
}

function extractJsxClasses(tsx) {
  const classes = new Set()
  const regex = /className="([^"]+)"/g
  let match
  while ((match = regex.exec(tsx)) !== null) {
    match[1].trim().split(/\s+/).forEach((c) => c && classes.add(c))
  }
  return classes
}

console.log('--- Checking JSX Classes Against Scoped Page CSS ---')
for (const p of pages) {
  const tsxPath = path.join(rawDir, p.file)
  const cssPath = path.join(stylesDir, p.css)

  if (!fs.existsSync(tsxPath) || !fs.existsSync(cssPath)) {
    console.log(`Skipping ${p.name}: missing tsx or css file`)
    continue
  }

  const tsx = fs.readFileSync(tsxPath, 'utf-8')
  const css = fs.readFileSync(cssPath, 'utf-8')

  const definedClasses = extractCssClasses(css)
  const usedClasses = extractJsxClasses(tsx)

  const missing = [...usedClasses].filter((c) => {
    if (c === p.scope || c === 'icon-stub') return false
    return !definedClasses.has(c)
  })

  console.log(`[${p.name}] Total JSX classes: ${usedClasses.size}, Missing from CSS: ${missing.length}`)
  if (missing.length > 0) {
    console.log(`   Missing classes: ${missing.join(', ')}`)
  }
}

console.log('\n--- Running TypeScript Compilation Check (tsc --noEmit) ---')
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit', cwd: path.resolve(import.meta.dirname, '..') })
  console.log('TypeScript check passed: 0 errors.')
} catch {
  console.error('TypeScript check failed.')
  process.exit(1)
}

