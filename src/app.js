import { randomUUID } from 'node:crypto'

const MAX_TITLE_LENGTH = 120
const MAX_BODY_SIZE_BYTES = 1_000_000

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
  const generatedAt = new Date().toISOString()

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Fullstack E2E Blueprint</title>
  <style>
    :root {
      --bg: #070b16;
      --ink: #f6f8ff;
      --muted: #a9b3c7;
      --line: rgba(255, 255, 255, .16);
      --accent: #88a3ff;
    }

    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      background:
        radial-gradient(900px 600px at 84% -20%, rgba(136,163,255,.25), transparent 60%),
        radial-gradient(700px 500px at 0% 30%, rgba(255,255,255,.06), transparent 60%),
        var(--bg);
      color: var(--ink);
      font-family: "Sora", "IBM Plex Sans", "Segoe UI", sans-serif;
      line-height: 1.45;
    }

    .hero {
      min-height: 100svh;
      display: grid;
      align-content: end;
      padding: clamp(1.2rem, 2vw, 2rem);
      border-bottom: 1px solid var(--line);
    }

    .inner {
      max-width: 1100px;
      margin: 0 auto;
      width: 100%;
      display: grid;
      gap: 1rem;
      opacity: 0;
      transform: translateY(14px);
      animation: rise .75s ease .1s forwards;
    }

    .kicker {
      margin: 0;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: .16em;
      font-size: .72rem;
      font-weight: 700;
    }

    h1 {
      margin: 0;
      font-size: clamp(2.1rem, 8vw, 5rem);
      line-height: .95;
      letter-spacing: -.03em;
      max-width: 11ch;
    }

    .copy {
      margin: 0;
      max-width: 50ch;
      color: var(--muted);
      font-size: clamp(1rem, 2.6vw, 1.24rem);
    }

    .actions {
      display: flex;
      gap: .72rem;
      flex-wrap: wrap;
    }

    .btn {
      text-decoration: none;
      color: var(--ink);
      border: 1px solid var(--line);
      padding: .76rem 1.04rem;
      font-weight: 600;
      font-size: .9rem;
      transition: transform .2s ease, border-color .2s ease;
    }

    .btn:hover {
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--accent) 75%, white 25%);
    }

    .btn.primary {
      background: color-mix(in srgb, var(--accent) 30%, transparent);
      border-color: color-mix(in srgb, var(--accent) 75%, white 25%);
    }

    .section {
      max-width: 1100px;
      margin: 0 auto;
      width: 100%;
      padding: clamp(1.2rem, 2.2vw, 2.3rem) clamp(1.2rem, 2vw, 2rem);
      border-bottom: 1px solid var(--line);
    }

    .endpoint-list {
      margin: 0;
      padding: 0;
      list-style: none;
      border-top: 1px solid var(--line);
    }

    .endpoint-list li {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: .72rem;
      border-bottom: 1px solid var(--line);
      padding: .72rem 0;
    }

    .method {
      min-width: 3.9rem;
      text-align: center;
      border: 1px solid var(--line);
      color: var(--accent);
      font-size: .72rem;
      font-weight: 700;
      letter-spacing: .1em;
      padding: .25rem .42rem;
    }

    .path {
      font-family: "IBM Plex Mono", "Consolas", monospace;
      color: #e6ecff;
      font-size: .85rem;
      word-break: break-word;
    }

    .meta {
      margin-top: .9rem;
      color: var(--muted);
      font-size: .8rem;
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
      border-top: 1px solid var(--line);
      padding-top: .8rem;
    }

    @keyframes rise {
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 800px) {
      .hero { align-content: center; }
      .endpoint-list li { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <header class="hero">
    <div class="inner">
      <p class="kicker">testing architecture</p>
      <h1 data-testid="title">Fullstack E2E Blueprint</h1>
      <p class="copy">Base de API com fluxo E2E completo para tarefas, cobrindo criacao, alteracao, filtro e remocao com validacao clara.</p>
      <div class="actions">
        <a class="btn primary" href="/health">Ver health</a>
        <a class="btn" href="#api">Explorar API</a>
      </div>
    </div>
  </header>

  <section class="section" id="api">
    <ul class="endpoint-list">
      <li><span class="method">GET</span><span class="path">/health</span></li>
      <li><span class="method">GET</span><span class="path">/api/tasks</span></li>
      <li><span class="method">POST</span><span class="path">/api/tasks</span></li>
      <li><span class="method">PATCH</span><span class="path">/api/tasks/:id/toggle</span></li>
      <li><span class="method">DELETE</span><span class="path">/api/tasks/:id</span></li>
    </ul>
    <div class="meta">
      <span>Ambiente pronto para smoke + e2e</span>
      <span>Atualizado em ${generatedAt}</span>
    </div>
  </section>
</body>
</html>`
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'content-type': 'application/json' })
  res.end(JSON.stringify(payload))
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let totalSize = 0
    req.on('data', (chunk) => {
      totalSize += chunk.length
      if (totalSize > MAX_BODY_SIZE_BYTES) {
        reject(new Error('payload excede limite de 1MB'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
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

