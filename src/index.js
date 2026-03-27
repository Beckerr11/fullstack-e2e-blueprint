import http from 'node:http'

const port = Number(process.env.PORT || 3000)

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ ok: true, service: 'fullstack-e2e-blueprint' }))
    return
  }

  res.writeHead(200, { 'content-type': 'application/json' })
  res.end(JSON.stringify({ message: 'Scaffold inicial de fullstack-e2e-blueprint' }))
})

server.listen(port, () => {
  console.log('fullstack-e2e-blueprint running on port ' + port)
})