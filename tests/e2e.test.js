import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import { createApp, createStore } from '../src/app.js'

async function request(baseUrl, path, options = {}) {
  return fetch(baseUrl + path, options)
}

async function requestJson(baseUrl, path, options = {}) {
  const response = await request(baseUrl, path, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(options.headers || {}),
    },
  })

  const data = await response.json()
  return { response, data }
}

test('e2e: create -> toggle -> filter -> get -> delete task via HTTP', async () => {
  const server = http.createServer(createApp(createStore()))
  await new Promise((resolve) => server.listen(0, resolve))

  const port = server.address().port
  const baseUrl = `http://127.0.0.1:${port}`

  try {
    const page = await request(baseUrl, '/')
    assert.equal(page.status, 200)
    assert.ok((await page.text()).includes('Fullstack E2E Blueprint'))

    const createdA = await requestJson(baseUrl, '/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: 'Task E2E A' }),
    })
    const createdB = await requestJson(baseUrl, '/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: 'Task E2E B' }),
    })

    assert.equal(createdA.response.status, 201)
    assert.equal(createdB.response.status, 201)
    const taskId = createdA.data.task.id

    const toggled = await requestJson(baseUrl, `/api/tasks/${taskId}/toggle`, {
      method: 'PATCH',
    })
    assert.equal(toggled.response.status, 200)
    assert.equal(toggled.data.task.done, true)

    const doneOnly = await requestJson(baseUrl, '/api/tasks?done=true')
    assert.equal(doneOnly.response.status, 200)
    assert.equal(doneOnly.data.tasks.length, 1)

    const fetched = await requestJson(baseUrl, `/api/tasks/${taskId}`)
    assert.equal(fetched.response.status, 200)
    assert.equal(fetched.data.task.id, taskId)

    const removed = await requestJson(baseUrl, `/api/tasks/${taskId}`, {
      method: 'DELETE',
    })
    assert.equal(removed.response.status, 200)

    const badPayload = await requestJson(baseUrl, '/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: '' }),
    })
    assert.equal(badPayload.response.status, 400)

    const invalidFilter = await requestJson(baseUrl, '/api/tasks?done=talvez')
    assert.equal(invalidFilter.response.status, 400)

    const listing = await requestJson(baseUrl, '/api/tasks')
    assert.equal(listing.data.tasks.length, 1)
  } finally {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())))
  }
})
