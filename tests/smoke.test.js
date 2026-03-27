import test from 'node:test'
import assert from 'node:assert/strict'
import { createStore, createTask, toggleTask, buildIndexHtml } from '../src/app.js'

test('task flow supports create and toggle for e2e baseline', () => {
  const store = createStore()
  const task = createTask(store, { title: 'Criar teste de login' })
  assert.equal(task.done, false)

  const toggled = toggleTask(store, task.id)
  assert.equal(toggled.done, true)
  assert.ok(buildIndexHtml().includes('Fullstack E2E Blueprint'))
})