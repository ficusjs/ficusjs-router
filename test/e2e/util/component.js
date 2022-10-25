import { renderer, html } from 'https://cdn.skypack.dev/@ficusjs/renderers@5/lit-html'
import { createComponent as componentCreator, createStore, withStore } from 'https://cdn.skypack.dev/ficusjs@5'
import { navigateTo } from './methods.js'

function createComponent (tagName, options) {
  componentCreator(tagName, { ...options, renderer, navigateTo })
}

function createComponentWithStore (tagName, options, store) {
  componentCreator(tagName, withStore(store, { ...options, renderer, navigateTo }))
}

const nothing = ''

export { createComponent, createComponentWithStore, createStore, html, nothing }
