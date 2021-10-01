// import { renderer, html } from 'https://cdn.skypack.dev/@ficusjs/renderers@4/lit-html'
import { renderer, html } from '../lib/lit-html.mjs'
// import { createComponent as componentCreator, createStore, withStore } from 'https://cdn.skypack.dev/ficusjs'
import { createComponent as componentCreator, createStore, withStore } from '../lib/index.mjs'
import { navigateTo } from './methods.js'

function createComponent (tagName, options) {
  componentCreator(tagName, { ...options, renderer, navigateTo })
}

function createComponentWithStore (tagName, options, store) {
  componentCreator(tagName, withStore(store, { ...options, renderer, navigateTo }))
}

const nothing = ''

export { createComponent, createComponentWithStore, createStore, html, nothing }
