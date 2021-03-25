import { FilterPattern } from '@rollup/pluginutils'
import debug from 'debug'
import { Plugin, ResolvedConfig } from 'vite'
import { VitePluginUniResolvedOptions } from '../..'
import { uniPrePlugin } from './pre'
import { uniJsonPlugin } from './json'
import { uniPreCssPlugin } from './preCss'
import { uniEasycomPlugin } from './easycom'
import { InjectOptions, uniInjectPlugin } from './inject'

import { uniAppVuePlugin } from './appVue'
import { uniMainJsPlugin } from './mainJs'
import { uniPagesJsonPlugin } from './pagesJson'
import { uniManifestJsonPlugin } from './manifestJson'
import { uniPageVuePlugin } from './pageVue'

const debugPlugin = debug('uni:plugin')

export interface UniPluginFilterOptions extends VitePluginUniResolvedOptions {
  include?: FilterPattern
  exclude?: FilterPattern
}

const UNI_H5_RE = /@dcloudio\/uni-h5/

const COMMON_EXCLUDE = [
  /pages\.json\.js$/,
  /manifest\.json\.js$/,
  /vue&type=/,
  /vite\//,
  /\/@vue\//,
  /\/vue-router\//,
  /\/vuex\//,
  /@dcloudio\/uni-h5-vue/,
  /@dcloudio\/uni-shared/,
  /\.html$/,
]

const uniPrePluginOptions: Partial<UniPluginFilterOptions> = {
  exclude: [...COMMON_EXCLUDE, UNI_H5_RE],
}
const uniPreCssPluginOptions: Partial<UniPluginFilterOptions> = {
  exclude: [UNI_H5_RE],
}

const uniEasycomPluginOptions: Partial<UniPluginFilterOptions> = {
  exclude: [/App.vue$/, UNI_H5_RE],
}

const uniInjectPluginOptions: Partial<InjectOptions> = {
  exclude: [...COMMON_EXCLUDE],
  '__GLOBAL__.': '@dcloudio/uni-h5',
  'uni.': '@dcloudio/uni-h5',
  getApp: ['@dcloudio/uni-h5', 'getApp'],
  getCurrentPages: ['@dcloudio/uni-h5', 'getCurrentPages'],
  UniServiceJSBridge: ['@dcloudio/uni-h5', 'UniServiceJSBridge'],
}

export function resolvePlugins(
  command: ResolvedConfig['command'],
  plugins: Plugin[],
  options: VitePluginUniResolvedOptions
) {
  addPlugin(
    plugins,
    uniPrePlugin(Object.assign(uniPrePluginOptions, options)),
    0,
    'pre'
  )
  addPlugin(plugins, uniAppVuePlugin(options), 1, 'pre')
  addPlugin(plugins, uniMainJsPlugin(options), 1, 'pre')
  addPlugin(plugins, uniPagesJsonPlugin(options), 1, 'pre')
  addPlugin(plugins, uniManifestJsonPlugin(options), 1, 'pre')

  addPlugin(
    plugins,
    uniPreCssPlugin(Object.assign(uniPreCssPluginOptions, options)),
    'vite:css'
  )
  if (command === 'build') {
    addPlugin(
      plugins,
      uniInjectPlugin(Object.assign(uniInjectPluginOptions, options)),
      'vite:vue'
    )
  }
  addPlugin(
    plugins,
    uniEasycomPlugin(Object.assign(uniEasycomPluginOptions, options)),
    'vite:vue'
  )
  addPlugin(plugins, uniPageVuePlugin({ command }), 'vite:vue')
  addPlugin(plugins, uniJsonPlugin(options), 'vite:json', 'pre')
  if (process.env.DEBUG) {
    debugPlugin(plugins.length)
    debugPlugin(plugins.map((p) => (p as Plugin).name))
  }
}

function addPlugin(
  plugins: Plugin[],
  plugin: Plugin,
  index: string | number,
  type: 'pre' | 'post' = 'post'
) {
  if (typeof index === 'string') {
    index = plugins.findIndex((plugin) => (plugin as Plugin).name === index)
  }
  return plugins.splice(index + (type === 'pre' ? 0 : 1), 0, plugin)
}