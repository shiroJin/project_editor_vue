const baseUrl = 'http://localhost:3000'

module.exports = {
  publicPath: '/',
  devServer: {
    proxy: {
      '/project': {
        target: baseUrl,
        changeOrigin: true
      },
      '/files': {
        target: baseUrl,
        changeOrigin: true
      },
      '/projectFile': {
        target: baseUrl,
        changeOrigin: true
      }
    },
    open: false
  }
}
