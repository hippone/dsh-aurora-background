#!/usr/bin/env node
/**
 * Build the format-1 plugin market index for this bundle.
 *
 * The index lists exactly this package (name, version, and one source pinned to
 * a commit or to npm), so a DSH user can add the published index as an index
 * source and install the entry from Plugins → Discover.
 *
 *   node market/build-index.mjs                       # git source at HEAD
 *   node market/build-index.mjs --source npm          # npm source (after publish)
 *   node market/build-index.mjs --commit <sha> --published <unix-seconds>
 *
 * Validate the result before publishing it: DSH rejects the whole index for the
 * first violated rule and shows the reason under the index source.
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')

/** Read one `--name value` argument. */
function arg(name, fallback) {
  const at = process.argv.indexOf(`--${name}`)
  return at >= 0 && process.argv[at + 1] !== undefined ? process.argv[at + 1] : fallback
}

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const repository = (pkg.repository?.url ?? '').replace(/^git\+/u, '').replace(/\.git$/u, '')
if (repository === '') throw new Error('package.json needs a repository.url')

const sourceKind = arg('source', 'git')
const commit = arg('commit', execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim())
const published = Number(arg('published', String(Math.floor(Date.now() / 1000))))
const out = arg('out', join(here, 'index.json'))

const source = sourceKind === 'npm'
  ? { type: 'npm' }
  : { type: 'git', url: repository, commit }

const index = {
  format: 1,
  title: { en: 'DSH plugins by hippone', zh: 'hippone 的 DSH 插件' },
  description: {
    en: 'Plugins published by hippone for the DeepSeek Harness Web GUI.',
    zh: 'hippone 发布的 DeepSeek Harness Web GUI 插件。',
  },
  metadata: {
    categories: { theme: { title: { en: 'Themes', zh: '主题' } } },
    labels: { ui: { title: { en: 'Interface', zh: '界面' } } },
    sortKeys: {
      github_stars: { title: { en: 'GitHub stars', zh: 'GitHub Star' }, order: 'desc' },
    },
  },
  plugins: [
    {
      name: pkg.name,
      title: { en: 'Aurora background', zh: '极光动态背景' },
      description: {
        en: 'A slowly drifting aurora behind the Web GUI, a translucent glass sidebar and conversation, an opaque composer, and a whale that leaps on the blank home.',
        zh: '为 Web 界面铺一层缓慢流动的极光，侧栏与会话呈半透明玻璃质感，输入框保持不透明，空白首页的鲸鱼会偶尔跃出水面。',
      },
      icon: 'icons/aurora-background.svg',
      author: 'Hans Desilva',
      ...(pkg.homepage === undefined ? {} : { homepage: pkg.homepage }),
      repository: { url: repository },
      metadata: {
        category: 'theme',
        keywords: pkg.keywords ?? [],
        labels: ['ui'],
      },
      versions: [
        {
          version: pkg.version,
          publishTimestamp: published,
          source,
          ...(pkg.engines?.dsh === undefined ? {} : { engines: { dsh: pkg.engines.dsh } }),
        },
      ],
    },
  ],
}

mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, `${JSON.stringify(index, null, 2)}\n`)
console.log(`wrote ${out}`)
console.log(`  ${pkg.name}@${pkg.version} from ${sourceKind}${sourceKind === 'git' ? ` ${commit.slice(0, 12)}` : ''}`)
