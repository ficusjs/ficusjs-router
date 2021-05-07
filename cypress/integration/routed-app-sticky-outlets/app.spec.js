/* global describe cy before it  */
describe('Sticky outlets', () => {
  before(() => {
    cy.visit('routed-app-sticky-outlets')
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

    it('should render foo contents in the view outlet', () => {
      cy.get('foo-contents')
        .should('contain.text', 'Foo contents')
    })

    it('should keep sticky text in the title outlet', () => {
      cy.get('#title')
        .should('contain.text', 'Home title outlet')
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

    it('should render bar contents in the view outlet', () => {
      cy.get('bar-contents')
        .should('contain.text', 'Bar contents with param Matt is one')
    })

    it('should render baz contents in the view outlet', () => {
      cy.get('baz-contents')
        .should('contain.text', 'Baz contents with param Matt is one')
    })

    it('should render text in the title outlet', () => {
      cy.get('#title')
        .should('contain.text', 'Page two title outlet')
    })
  })

  describe('route to home from page two content', () => {
    before(() => {
      cy.get('nav button:nth-of-type(1)').click()
    })

    it('has rendered the home page', () => {
      cy.get('#router-outlet')
        .should('contain.text', 'Welcome to the home page!')
    })

    it('home page navigation is active', () => {
      cy.get('button.active')
        .should('have.text', 'Home')
    })

    it('should render text in the title outlet', () => {
      cy.get('#title')
        .should('contain.text', 'Page two title outlet')
    })
  })
})
