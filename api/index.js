import { createApp, createStore } from '../src/app.js'

const store = globalThis.__fullstackBlueprintStore || (globalThis.__fullstackBlueprintStore = createStore())
const app = createApp(store)

export default app
