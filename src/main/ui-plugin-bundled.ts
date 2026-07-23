import { readFile, stat, writeFile } from 'node:fs/promises'
import { mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import ikunFigureRef from '../asset/img/ikun.png?url'
import ikunRunFigureRef from '../asset/img/ikun_run.png?url'
import ikunBobaFigureRef from '../asset/img/ikun_boba.png?url'
import ikunWaveFigureRef from '../asset/img/ikun_wave.png?url'
import ikunSleepFigureRef from '../asset/img/ikun_sleep.png?url'
import ikunStandFigureRef from '../asset/img/ikun_stand.png?url'
import { UI_PLUGIN_BUNDLED_IKUN_ID } from '../shared/ui-plugin'
import { seedUiPlugin, uiPluginsRootDir } from './services/ui-plugin-service'

/**
 * 预装 UI 插件:iKun 模式就是形象工坊的官方示例插件,
 * 首次启动时自动安装进 ~/.kun/ui-plugins/ikun/。
 * 安装只做一次(种子标记),用户删掉后不会被强行复活。
 */

const BUNDLED_SEED_MARKER = '.bundled-seed-v1'

/**
 * iKun 的 manifest。注意:激活 id 为 'ikun' 的插件时,渲染层会额外点亮
 * data-ikun-mode 的手工 CSS 机制(运球/快攻/喝奶茶变体、橙色氛围),
 * 所以这里的 figures 主要服务于工坊预览与通用槽位兜底。
 */
const BUNDLED_IKUN_MANIFEST = {
  id: UI_PLUGIN_BUNDLED_IKUN_ID,
  name: 'iSnS 模式',
  // 1.1.0:品牌 iKun → iSnS 重命名。version 变化会触发对【已播种且未被用户
  // 删除】的插件做一次性重播,把磁盘上旧的 manifest（name 仍是 iKun）刷新。
  version: '1.1.0',
  author: 'SnS Team',
  description: '预装示例插件:坤鸡全家福,附手工运球/快攻/喝奶茶动画与出没彩蛋。',
  figures: {
    swim: 'img/dribble.png',
    run: 'img/run.png',
    greet: 'img/wave.png',
    sleep: 'img/sleep.png',
    sit: 'img/boba.png',
    toggleIcon: 'img/stand.png'
  },
  features: {
    cameos: true
  }
}

const BUNDLED_IKUN_FIGURE_REFS: Record<string, string> = {
  swim: ikunFigureRef,
  run: ikunRunFigureRef,
  greet: ikunWaveFigureRef,
  sleep: ikunSleepFigureRef,
  sit: ikunBobaFigureRef,
  toggleIcon: ikunStandFigureRef
}

/** bundle 所在目录,用于把 ?url 的 /chunks/xxx.png 还原为真实文件路径 */
const BUNDLE_DIR = dirname(fileURLToPath(import.meta.url))

/**
 * 资源引用在打包/开发下可能是:
 *   - data URL ("data:image/png;base64,...")  → 直接 base64 解码
 *   - Vite ?url 在主进程中的 web 路径 ("/chunks/xxx.png") → 相对 bundle 目录拼绝对路径
 */
async function bytesFromAssetRef(ref: string): Promise<Buffer> {
  if (ref.startsWith('data:')) {
    const base64 = ref.slice(ref.indexOf(',') + 1)
    return Buffer.from(base64, 'base64')
  }
  return readFile(join(BUNDLE_DIR, ref))
}

let seedPromise: Promise<void> | null = null

export function ensureBundledUiPlugins(kunHomeDir: string): Promise<void> {
  seedPromise ??= (async () => {
    const rootDir = uiPluginsRootDir(kunHomeDir)
    const markerPath = join(rootDir, BUNDLED_SEED_MARKER)
    const pluginDir = join(rootDir, UI_PLUGIN_BUNDLED_IKUN_ID)
    const seedVersion = BUNDLED_IKUN_MANIFEST.version

    // marker 现在记录已播种的 manifest 版本(旧版本写的是 'ikun',视为 <当前版本)。
    let markerVersion: string | null = null
    try {
      markerVersion = (await readFile(markerPath, 'utf8')).trim()
    } catch {
      // 尚未播种
    }

    // 已经是当前版本 → 无需任何动作。
    if (markerVersion === seedVersion) return

    const firstSeed = markerVersion === null
    if (!firstSeed) {
      // 之前播种过更早版本。仅当插件目录仍在(用户没删)才重播刷新;
      // 用户主动删掉的不复活,只把 marker 推进到当前版本避免每次启动重试。
      let pluginExists = false
      try {
        await stat(pluginDir)
        pluginExists = true
      } catch {
        // 插件已被移除
      }
      if (!pluginExists) {
        try {
          await mkdir(rootDir, { recursive: true })
          await writeFile(markerPath, seedVersion, 'utf8')
        } catch {
          // 标记写入失败可接受,下次再判定
        }
        return
      }
    }

    // 首次播种,或旧版本且插件仍在 →(重新)播种。seedUiPlugin 会先清空目标目录再写入。
    let seeded = false
    try {
      const figureBytes: Record<string, Buffer> = {}
      for (const [slot, ref] of Object.entries(BUNDLED_IKUN_FIGURE_REFS)) {
        figureBytes[slot] = await bytesFromAssetRef(ref)
      }
      const result = await seedUiPlugin(kunHomeDir, BUNDLED_IKUN_MANIFEST, figureBytes)
      if (result.ok) {
        seeded = true
      } else {
        console.error('[ui-plugin] failed to seed bundled ikun plugin:', result.errors.join('; '))
      }
    } catch (error) {
      console.error('[ui-plugin] bundled seed error:', error)
    }
    // 只有成功播种才写标记,失败时下次启动允许重试
    if (seeded) {
      try {
        await mkdir(rootDir, { recursive: true })
        await writeFile(markerPath, seedVersion, 'utf8')
      } catch {
        // 标记写入失败可接受,下次会重试播种
      }
    }
  })()
  return seedPromise
}
