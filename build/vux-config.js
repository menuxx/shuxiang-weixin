
module.exports = {
  options: {
    vuxWriteFile: false,
    env: 'dev'
  },
  plugins: [
    'vux-ui', 'inline-manifest',
    {
      name: 'duplicate-style',
      envs: ['production']
    },
    {
      name: 'progress-bar',
      envs: ['development']
    }
  ]
}