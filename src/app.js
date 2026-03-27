import { randomUUID } from 'node:crypto'

const MAX_TITLE_LENGTH = 120

export function createStore() {
  return {
    tasks: [],
  }
}

function normalizeTaskTitle(title) {
  const taskTitle = String(title || '').trim()
  if (!taskTitle) {
    throw new Error('title e obrigatorio')
  }
  if (taskTitle.length > MAX_TITLE_LENGTH) {
    throw new Error(`title deve ter no maximo ${MAX_TITLE_LENGTH} caracteres`)
  }
  return taskTitle
}

export function createTask(store, { title }) {
  const task = {
    id: randomUUID(),
    title: normalizeTaskTitle(title),
    done: false,
    createdAt: new Date().toISOString(),
  }

  store.tasks.push(task)
  return task
}

export function getTaskById(store, taskId) {
  const task = store.tasks.find((item) => item.id === taskId)
  if (!task) {
    throw new Error('task nao encontrada')
  }
  return task
}

export function listTasks(store, filters = {}) {
  const doneFilter = filters.done
  return store.tasks.filter((task) => {
    if (doneFilter === undefined) {
      return true
    }
    return task.done === doneFilter
  })
}

export function toggleTask(store, taskId) {
  const task = getTaskById(store, taskId)
  task.done = !task.done
  return task
}

export function removeTask(store, taskId) {
  const index = store.tasks.findIndex((item) => item.id === taskId)
  if (index < 0) {
    throw new Error('task nao encontrada')
  }

  const [removed] = store.tasks.splice(index, 1)
  return removed
}

export function buildIndexHtml() {
  return [
    '<!doctype html>',
    '<html lang="pt-BR">',
    '<head><meta charset="utf-8"><title>Fullstack E2E Blueprint</title></head>',
    '<body>',
    '<h1 data-testid="title">Fullstack E2E Blueprint</h1>',
    '<p>Use os endpoints /api/tasks e /health para o fluxo de testes.</p>',
    '</body>',
    '</html>',
  ].join('')
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'content-type': 'application/json' })
  res.end(JSON.stringify(payload))
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      if (!chunks.length) {
        resolve({})
        return
      }

      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch {
        reject(new Error('JSON invalido'))
      }
    })
    req.on('error', reject)
  })
}

function parseDoneFilter(searchParams) {
  const done = searchParams.get('done')
  if (done === null) {
    return undefined
  }
  if (done === 'true') {
    return true
  }
  if (done === 'false') {
    return false
  }
  throw new Error('filtro done invalido')
}

export function createApp(store = createStore()) {
  return async function app(req, res) {
    const url = new URL(req.url || '/', 'http://localhost')

    try {
      if (req.method === 'GET' && url.pathname === '/health') {
        sendJson(res, 200, { ok: true, service: 'fullstack-e2e-blueprint' })
        return
      }

      if (req.method === 'GET' && url.pathname === '/') {
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
        res.end(buildIndexHtml())
        return
      }

      if (req.method === 'GET' && url.pathname === '/api/tasks') {
        const done = parseDoneFilter(url.searchParams)
        sendJson(res, 200, { tasks: listTasks(store, { done }) })
        return
      }

      if (req.method === 'POST' && url.pathname === '/api/tasks') {
        const payload = await readJsonBody(req)
        const task = createTask(store, payload)
        sendJson(res, 201, { task })
        return
      }

      const taskMatch = url.pathname.match(/^\/api\/tasks\/([^/]+)$/)
      if (req.method === 'GET' && taskMatch) {
        const task = getTaskById(store, taskMatch[1])
        sendJson(res, 200, { task })
        return
      }

      const toggleMatch = url.pathname.match(/^\/api\/tasks\/([^/]+)\/toggle$/)
      if (req.method === 'PATCH' && toggleMatch) {
        const task = toggleTask(store, toggleMatch[1])
        sendJson(res, 200, { task })
        return
      }

      if (req.method === 'DELETE' && taskMatch) {
        const task = removeTask(store, taskMatch[1])
        sendJson(res, 200, { task })
        return
      }

      sendJson(res, 404, { error: 'rota nao encontrada' })
    } catch (error) {
      sendJson(res, 400, { error: error instanceof Error ? error.message : 'erro inesperado' })
    }
  }
}
