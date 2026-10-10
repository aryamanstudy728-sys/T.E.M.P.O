import fs from 'fs'
import path from 'path'
import * as cheerio from 'cheerio'
import postcss from 'postcss'
import prefixer from 'postcss-prefix-selector'

const kombaiDir = path.resolve(import.meta.dirname, '../../design/kombai')
const stylesDir = path.resolve(import.meta.dirname, '../src/styles')
const originalDir = path.resolve(stylesDir, '_original')

fs.mkdirSync(originalDir, { recursive: true })

const pages = [
  { name: 'dashboard', file: 'Map-led_Dispatch___Dashboard.html', root: '.tempo-screen', scope: '.page-dashboard' },
  { name: 'routes', file: 'Map-led_Dispatch___Routes.html', root: '#tempo-shell', scope: '.page-routes' },
  { name: 'alerts', file: 'Map-led_Dispatch___Alerts.html', root: '.alert-app', scope: '.page-alerts' },
  { name: 'analytics', file: 'Map-led_Dispatch___Analytics.html', root: '.tempo-ui', scope: '.page-analytics' },
]

function countSelectors(css) {
  const ast = postcss.parse(css)
  let count = 0
  ast.walkRules((rule) => {
    count += rule.selectors ? rule.selectors.length : 1
  })
  return count
}

function extractRootCustomProperties(css, rootSelector) {
  const ast = postcss.parse(css)
  const props = []
  ast.walkRules((rule) => {
    if (rule.selector === rootSelector || (rootSelector === '.alert-app' && rule.selector === ':root')) {
      rule.walkDecls((decl) => {
        if (decl.prop.startsWith('--')) {
          props.push(decl.prop)
        }
      })
    }
  })
  return props
}

for (const page of pages) {
  const htmlPath = path.join(kombaiDir, page.file)
  const html = fs.readFileSync(htmlPath, 'utf-8')
  const $ = cheerio.load(html)

  const rawCss = $('#root style').text()
  const importRegex = /@import\s+url\([^)]+\)\s*;\n?/g
  const removedImports = rawCss.match(importRegex) || []

  console.log(`\n--- ${page.name} (${page.file}) ---`)
  console.log('Removed @import lines:')
  removedImports.forEach((imp) => console.log('  ', imp.trim()))

  const cleanCss = rawCss.replace(importRegex, '').trim() + '\n'

  const origPath = path.join(originalDir, `kombai-${page.name}.css`)
  fs.writeFileSync(origPath, cleanCss, 'utf-8')

  const processor = postcss().use(
    prefixer({
      prefix: page.scope,
      transform(prefix, selector) {
        if (selector === ':root') {
          return prefix
        }
        if (selector.startsWith(page.root)) {
          return `${prefix}${selector}`
        }
        return `${prefix} ${selector}`
      },
    }),
  )

  const prefixed = await processor.process(cleanCss, { from: origPath })
  const outPath = path.join(stylesDir, `kombai-${page.name}.css`)
  fs.writeFileSync(outPath, prefixed.css, 'utf-8')

  const selBefore = countSelectors(cleanCss)
  const selAfter = countSelectors(prefixed.css)
  const rootProps = extractRootCustomProperties(cleanCss, page.root)

  console.log(`Selectors: ${selBefore} -> ${selAfter}`)
  console.log(`Root custom properties: [${rootProps.join(', ')}]`)
  console.log(`Wrote: ${outPath}`)
}

