module.exports = {
  secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secretHSHDJAKAKAKAKAKKAAKUDBXNNXNSJ',
  api: process.env.API || 'http://localhost:3000',
  loja: process.env.LOJA || 'http://localhost:8000',
}