import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enCommon from './locales/en/common.json'
import enSettings from './locales/en/settings.json'
import hiCommon from './locales/hi/common.json'
import hiSettings from './locales/hi/settings.json'
import jaCommon from './locales/ja/common.json'
import jaSettings from './locales/ja/settings.json'
import koCommon from './locales/ko/common.json'
import koSettings from './locales/ko/settings.json'
import ruCommon from './locales/ru/common.json'
import ruSettings from './locales/ru/settings.json'
import thCommon from './locales/th/common.json'
import thSettings from './locales/th/settings.json'
import zhCommon from './locales/zh/common.json'
import zhSettings from './locales/zh/settings.json'
import { APP_LOCALES } from '@shared/app-locales'

// vitest(node 环境)会设置 process.env.VITEST;生产渲染层通常没有 process。
// 用 globalThis 探测,避免在 web tsconfig 下直接引用 node 的 process 类型。
const isVitestEnv =
  typeof (globalThis as { process?: { env?: Record<string, string | undefined> } }).process !== 'undefined' &&
  Boolean((globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.VITEST)

void i18n.use(initReactI18next).init({
  resources: {
    en: { common: enCommon, settings: enSettings },
    zh: { common: zhCommon, settings: zhSettings },
    ru: { common: ruCommon, settings: ruSettings },
    hi: { common: hiCommon, settings: hiSettings },
    th: { common: thCommon, settings: thSettings },
    ja: { common: jaCommon, settings: jaSettings },
    ko: { common: koCommon, settings: koSettings }
  },
  // 引导前的 bootstrap 语言。生产默认简体中文,与设置默认 locale=zh 一致,
  // 保证首屏/引导页即为中文,不依赖启动时 applyI18nFromSettings 的异步切换。
  // vitest 下仍用 en 作为稳定基准(大量组件单测按英文文案断言)。
  lng: isVitestEnv ? 'en' : 'zh',
  fallbackLng: 'en',
  supportedLngs: APP_LOCALES,
  load: 'languageOnly',
  interpolation: { escapeValue: false },
  defaultNS: 'common',
  ns: ['common', 'settings']
})

export default i18n
