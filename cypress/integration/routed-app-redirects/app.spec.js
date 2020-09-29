/* global describe cy before it  */
describe('Redirects', () => {
  before(() => {
    cy.visit('routed-app-redirects')
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

    it('has rendered page two', () => {
      cy.get('#router-outlet')
        .should('contain.text', 'Welcome to page two!')
    })

    it('page two navigation is active', () => {
      cy.get('button.active')
        .should('have.text', 'Page two')
    })

    it('page two location is active', () => {
      cy.location('pathname')
        .should('equal', '/test/e2e/routed-app-redirects/two')
    })
  })
})
