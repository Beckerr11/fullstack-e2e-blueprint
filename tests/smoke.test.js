import test from 'node:test'
import assert from 'node:assert/strict'
import { createStore, createTask, toggleTask, removeTask, buildIndexHtml } from '../src/app.js'

test('task flow supports create, toggle and remove', () => {
  const store = createStore()
  const task = createTask(store, { title: 'Criar teste de login' })
  assert.equal(task.done, false)

  const toggled = toggleTask(store, task.id)
  assert.equal(toggled.done, true)

  const removed = removeTask(store, task.id)
  assert.equal(removed.id, task.id)
  assert.equal(store.tasks.length, 0)

  assert.ok(buildIndexHtml().includes('Fullstack E2E Blueprint'))
})