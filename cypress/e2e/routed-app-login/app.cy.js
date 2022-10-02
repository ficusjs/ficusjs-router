/* global describe cy before it  */
describe('Login', () => {
  before(() => {
    cy.visit('routed-app-login')
  })

  it('has rendered the login page', () => {
    cy.get('button[type="submit"]')
      .should('have.text', 'Login')
    cy.get('input[type="email"]')
      .should('exist')
    cy.get('input[type="password"]')
      .should('exist')
  })

  it('does not have a logout button', () => {
    cy.get('nav button:last')
      .should('contain.text', 'Fake page')
  })

  describe('logging in', () => {
    before(() => {
      cy.get('input[type="email"]').type('test@test.com')
      cy.get('input[type="password"]').type('test')
      cy.get('button[type="submit"]').click()
    })

    it('has rendered the home page', () => {
      cy.get('#router-outlet')
        .should('contain.text', 'You are logged in test@test.com')
    })

    it('home page navigation is active', () => {
      cy.get('button.active')
        .should('have.text', 'Home')
    })

    it('has a logout button', () => {
      cy.get('nav button:last')
        .should('have.text', 'Logout')
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

    describe('logout', () => {
      before(() => {
        cy.get('nav button:last').click()
      })

      it('has rendered the login page', () => {
        cy.get('button[type="submit"]')
          .should('have.text', 'Login')
        cy.get('input[type="email"]')
          .should('exist')
        cy.get('input[type="password"]')
          .should('exist')
      })

      it('does not have a logout button', () => {
        cy.get('nav button:last')
          .should('have.text', 'Fake page')
      })
    })
  })
})
