import { render as renderer, html } from 'https://unpkg.com/lit-html?module'
import { createComponent as componentCreator, createStore, withStore } from 'https://unpkg.com/ficusjs?module'
import { navigateTo } from './methods.js'

function createComponent (tagName, options) {
  componentCreator(tagName, { ...options, renderer, navigateTo })
}

function createComponentWithStore (tagName, options, store) {
  componentCreator(tagName, withStore(store, { ...options, renderer, navigateTo }))
}

const nothing = ''

export { createComponent, createComponentWithStore, createStore, html, nothing }
