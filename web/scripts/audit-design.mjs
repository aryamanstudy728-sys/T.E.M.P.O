import fs from 'fs'
import path from 'path'
import * as cheerio from 'cheerio'

const kombaiDir = path.resolve(import.meta.dirname, '../../design/kombai')
const files = fs.readdirSync(kombaiDir).filter((f) => f.endsWith('.html')).sort()

function extractCssClasses(css) {
  const classes = new Set()
  const regex = /\.([a-zA-Z0-9_-]+)/g
  let match
  while ((match = regex.exec(css)) !== null) {
    classes.add(match[1])
  }
  return classes
}

function countUnprefixedSelectors(css, rootSelector) {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '')
  const rules = clean.split('}')
  let count = 0
  for (const r of rules) {
    const parts = r.split('{')
    if (parts.length < 2) continue
    const selectorPart = parts[0].trim()
    if (selectorPart.startsWith('@') || !selectorPart) continue
    const selectors = selectorPart.split(',')
    for (const sel of selectors) {
      const s = sel.trim()
      if (s && !s.startsWith(rootSelector)) {
        count++
      }
    }
  }
  return count
}

const results = []

for (const file of files) {
  const filePath = path.join(kombaiDir, file)
  const html = fs.readFileSync(filePath, 'utf-8')
  const $ = cheerio.load(html)

  const rootDiv = $('#root')
  let firstElem = null
  rootDiv.children().each((_, el) => {
    if (el.tagName && el.tagName !== 'style' && !firstElem) {
      firstElem = $(el)
    }
  })

  const rootId = firstElem ? firstElem.attr('id') : null
  const rootClass = firstElem ? firstElem.attr('class') : null
  const rootDescriptor = rootId ? `#${rootId}` : rootClass ? `.${rootClass.trim().split(/\s+/)[0]}` : 'unknown'

  const css = $('style')
    .map((_, el) => $(el).text())
    .get()
    .join('\n')
  const definedClasses = extractCssClasses(css)

  const markupClasses = new Set()
  $('*').each((_, el) => {
    const cls = $(el).attr('class')
    if (cls) {
      cls.trim().split(/\s+/).forEach((c) => {
        // Exclude external webfont Tabler classes
        if (c && !c.startsWith('ti')) {
          markupClasses.add(c)
        }
      })
    }
  })

  const missingClasses = [...markupClasses].filter((c) => !definedClasses.has(c))
  const hasScript = $('body script').length > 0 || $('script').length > 0
  const usesTabler = $('[class*="ti-"], .ti').length > 0
  const unprefixed = countUnprefixedSelectors(css, rootDescriptor)

  results.push({
    file,
    root: rootDescriptor,
    missingClassesCount: missingClasses.length,
    missingClasses,
    hasScript,
    usesTabler,
    unprefixed,
  })
}

console.log('| File | Root Element | Missing Classes (excl. Tabler) | Script | Tabler Font | Unprefixed Selectors |')
console.log('| :--- | :--- | :---: | :---: | :---: | :---: |')
for (const r of results) {
  console.log(`| ${r.file} | \`${r.root}\` | ${r.missingClassesCount} | ${r.hasScript} | ${r.usesTabler} | ${r.unprefixed} |`)
}

