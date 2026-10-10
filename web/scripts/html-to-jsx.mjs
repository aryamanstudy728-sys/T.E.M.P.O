import fs from 'fs'
import path from 'path'
import * as cheerio from 'cheerio'

const kombaiDir = path.resolve(import.meta.dirname, '../../design/kombai')
const outDir = path.resolve(import.meta.dirname, '../src/pages/_raw')
fs.mkdirSync(outDir, { recursive: true })

const pageConfigs = [
  { name: 'Dashboard', file: 'Map-led_Dispatch___Dashboard.html', rootClass: 'tempo-screen', scopeClass: 'page-dashboard' },
  { name: 'Routes', file: 'Map-led_Dispatch___Routes.html', rootId: 'tempo-shell', scopeClass: 'page-routes' },
  { name: 'Alerts', file: 'Map-led_Dispatch___Alerts.html', rootClass: 'alert-app', scopeClass: 'page-alerts' },
  { name: 'Analytics', file: 'Map-led_Dispatch___Analytics.html', rootClass: 'tempo-ui', scopeClass: 'page-analytics' },
]

function styleToJsx(styleStr) {
  const parts = styleStr.split(';').map((s) => s.trim()).filter(Boolean)
  const props = parts
    .map((p) => {
      const idx = p.indexOf(':')
      if (idx === -1) return null
      const key = p.slice(0, idx).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase())
      const val = p.slice(idx + 1).trim()
      return `${key}: ${JSON.stringify(val)}`
    })
    .filter(Boolean)
  return `style={{ ${props.join(', ')} }}`
}

export function convertPage(cfg) {
  const html = fs.readFileSync(path.join(kombaiDir, cfg.file), 'utf-8')
  const $ = cheerio.load(html, { xml: false, decodeEntities: false })

  const root = $('#root')
  root.find('style').remove()

  root.find('script').each((_, el) => {
    const text = $(el).text()
    if (text) {
      console.log(`[${cfg.name}] Dropped script (first 200 chars):`)
      console.log(text.slice(0, 200).trim())
    }
    $(el).remove()
  })

  root.find('svg.map-svg, .map-stage > svg').replaceWith('__MAP_PLACEHOLDER__')

  const icons = new Set()
  root.find('i[class*="ti-"]').each((_, el) => {
    const cls = $(el).attr('class') || ''
    const match = cls.match(/ti-([a-zA-Z0-9-]+)/)
    if (match) {
      icons.add(match[1])
      $(el).replaceWith(`__ICON_${match[1]}__`)
    }
  })
  console.log(`[${cfg.name}] Unique icons (${icons.size}):`, [...icons].sort().join(', '))

  root.find('*').removeAttr('data-kid').removeAttr('data-name')

  let body = root.html() || ''

  body = body.replace(/__MAP_PLACEHOLDER__/g, '{/* MAP */}')
  body = body.replace(/__ICON_([a-zA-Z0-9-]+)__/g, '<Icon name="$1" />')
  body = body.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}')
  body = body.replace(/\bclass="/g, 'className="')
  body = body.replace(/\bfor="/g, 'htmlFor="')
  body = body.replace(/\btabindex="(-?\d+)"/gi, 'tabIndex={$1}')
  body = body.replace(/\bdisabled=""/g, 'disabled')
  body = body.replace(/\bautocomplete="/g, 'autoComplete="')
  body = body.replace(/\bautofocus="/g, 'autoFocus="')
  body = body.replace(/\bstyle="([^"]*)"/g, (_, s) => styleToJsx(s))

  const svgAttrs = ['viewBox', 'strokeWidth', 'strokeLinecap', 'strokeLinejoin', 'fillRule', 'clipRule', 'strokeDasharray', 'preserveAspectRatio']
  svgAttrs.forEach((attr) => {
    body = body.replace(new RegExp(`\\b${attr.toLowerCase()}="`, 'g'), `${attr}="`)
  })

  body = body.replace(/<(input|col|br|hr|img|path|circle|rect|line|polyline|polygon)\b([^>]*?)(?<!\/)>/g, '<$1$2 />')

  if (cfg.rootClass) {
    body = body.replace(new RegExp(`className="${cfg.rootClass}"`), `className="${cfg.rootClass} ${cfg.scopeClass}"`)
  } else if (cfg.rootId) {
    body = body.replace(new RegExp(`id="${cfg.rootId}"`), `id="${cfg.rootId}" className="${cfg.scopeClass}"`)
  }

  const jsxContent = `import Icon from '../../components/Icon'
import '../../styles/kombai-${cfg.name.toLowerCase()}.css'

export function ${cfg.name}Raw() {
  return (
${body
  .split('\n')
  .map((line) => '    ' + line)
  .join('\n')}
  )
}

export default ${cfg.name}Raw
`
  const outPath = path.join(outDir, `${cfg.name}.raw.tsx`)
  fs.writeFileSync(outPath, jsxContent, 'utf-8')
  console.log(`[${cfg.name}] Wrote ${outPath}`)
}

const target = process.argv[2]
const targets = target ? pageConfigs.filter((p) => p.name.toLowerCase() === target.toLowerCase()) : pageConfigs
targets.forEach(convertPage)
