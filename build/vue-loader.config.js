module.exports = (isDev) => {
  return {
    // 消除模板空格的影响
    preserveWhitepace: true,
    // 单独打包 css
    extractCSS: !isDev,
    cssModules: {
      // css 打包命名方式
      localIdentName: isDev ? '[path]-[name]-[hash:base64:5]' : '[hash:base64:5]',
      // 转化 css - 的命名方式为驼峰
      camelCase: true
    },
    // hotReload: false, // 根据环境变量生成
  }
}