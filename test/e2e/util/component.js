import { render as renderer, html } from 'https://unpkg.com/lit-html?module'
import { createComponent as componentCreator, createStore } from 'https://unpkg.com/ficusjs?module'
import { navigateTo } from './methods.js'

function createComponent (tagName, options) {
  componentCreator(tagName, { ...options, renderer, navigateTo })
}

const nothing = ''

export { createComponent, createStore, html, nothing }
