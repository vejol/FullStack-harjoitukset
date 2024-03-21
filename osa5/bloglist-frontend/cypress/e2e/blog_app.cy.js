describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Silja Silvonen',
      username: 'siljasi',
      password: 'password123'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function () {
    cy.contains('log in')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('siljasi')
      cy.get('#password').type('password123')
      cy.get('#login-button').click()

      cy.contains('Silja Silvonen')
    })

    it('fails with wrong credentials', function () {
      // ...
    })
  })
})