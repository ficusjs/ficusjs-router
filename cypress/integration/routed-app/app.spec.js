/* global describe cy before it  */
describe('Routed app', () => {
  before(() => {
    cy.visit('routed-app')
  })

  it('has rendered the home page', () => {
    cy.get('#router-outlet')
      .should('contain.text', 'Welcome to the home page!')
  })

  it('home page navigation is active', () => {
    cy.get('button.active')
      .should('have.text', 'Home')
  })

  describe('route to page one', () => {
    before(() => {
      cy.get('button:nth-of-type(2)').click()
    })

    it('has rendered page one', () => {
      cy.get('#router-outlet')
        .should('contain.text', 'Welcome to page one!')
    })

    it('page one navigation is active', () => {
      cy.get('button.active')
        .should('have.text', 'Page one')
    })
  })

  describe('route to page two', () => {
    before(() => {
      cy.get('button:nth-of-type(3)').click()
    })

    it('has rendered page two', () => {
      cy.get('#router-outlet')
        .should('contain.text', 'Welcome to page two!')
    })

    it('page two navigation is active', () => {
      cy.get('button.active')
        .should('have.text', 'Page two')
    })
  })

  describe('route to home from page two content', () => {
    before(() => {
      cy.get('#router-outlet button').click()
    })

    it('has rendered the home page', () => {
      cy.get('#router-outlet')
        .should('contain.text', 'Welcome to the home page!')
    })

    it('home page navigation is active', () => {
      cy.get('button.active')
        .should('have.text', 'Home')
    })
  })

  describe('route to fake page', () => {
    before(() => {
      cy.get('button:nth-of-type(4)').click()
    })

    it('has rendered an error', () => {
      cy.get('#router-outlet')
        .should('contain.text', 'Router error: not_found')
    })
  })
})
