import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import { createApp, createStore } from '../src/app.js'

async function requestJson(baseUrl, path, options = {}) {
  const response = await fetch(baseUrl + path, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(options.headers || {}),
    },
  })

  const data = await response.json()
  return { response, data }
}

test('e2e: create -> toggle -> delete task via HTTP', async () => {
  const server = http.createServer(createApp(createStore()))
  await new Promise((resolve) => server.listen(0, resolve))

  const port = server.address().port
  const baseUrl = `http://127.0.0.1:${port}`

  try {
    const created = await requestJson(baseUrl, '/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: 'Task E2E' }),
    })

    assert.equal(created.response.status, 201)
    const taskId = created.data.task.id

    const toggled = await requestJson(baseUrl, `/api/tasks/${taskId}/toggle`, {
      method: 'PATCH',
    })
    assert.equal(toggled.response.status, 200)
    assert.equal(toggled.data.task.done, true)

    const removed = await requestJson(baseUrl, `/api/tasks/${taskId}`, {
      method: 'DELETE',
    })
    assert.equal(removed.response.status, 200)

    const listing = await requestJson(baseUrl, '/api/tasks')
    assert.equal(listing.data.tasks.length, 0)
  } finally {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())))
  }
})