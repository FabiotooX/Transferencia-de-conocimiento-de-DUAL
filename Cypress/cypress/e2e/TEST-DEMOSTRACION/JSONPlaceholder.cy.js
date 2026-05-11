/// <reference types="cypress" />

describe('JSONPlaceholder', () => {

  it('GET /posts', () => {
    cy.request('https://jsonplaceholder.typicode.com/posts').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.length(100)
      cy.log(JSON.stringify(response.body, null, 2))
    })
  })

  it('GET /posts/1', () => {
    cy.request('https://jsonplaceholder.typicode.com/posts/1').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.property('id', 1)
      cy.log(JSON.stringify(response.body, null, 2))
    })
  })

  it('GET /comments?postId=1', () => {
    cy.request('https://jsonplaceholder.typicode.com/comments?postId=1').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.length(5)
      cy.log(JSON.stringify(response.body, null, 2))
    })
  })
})