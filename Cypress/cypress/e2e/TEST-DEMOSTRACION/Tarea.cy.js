/// <reference types="cypress" />

// ENUNCIADO:
// Usando la API JSONPlaceholder y los fixtures (datos externos en JSON),
// completa los siguientes 4 ejercicios que cubren las operaciones CRUD:
//   1. Crear un post (POST)
//   2. Actualizar un post (PUT)
//   3. Borrar un post (DELETE)
//   4. Filtrar posts por userId (GET con query params)
//
// GUÍA:
// - Los datos para POST y PUT se cargan desde los archivos
//   cypress/fixtures/POST.json y cypress/fixtures/PUT.json usando cy.fixture().
// - cy.fixture('archivo.json').as('alias') carga el JSON y lo guarda
//   en this.alias para usarlo en los tests.
// - IMPORTANTE: Para que 'this' funcione con los alias de Cypress,
//   hay que usar function() en vez de arrow functions (=>).
//   Las arrow functions NO tienen su propio 'this'.
// - Los fixtures se cargan en beforeEach para que estén disponibles
//   en todos los tests antes de que se ejecuten.

describe('JSONPlaceholder API - Tareas', function () {

    // beforeEach se ejecuta ANTES de cada test.
    // Cargamos los fixtures aquí para que this.postData y this.putData
    // estén disponibles en todos los tests.
    beforeEach(function () {
        cy.fixture('POST.json').as('postData')
        cy.fixture('PUT.json').as('putData')
    })

    // Ejercicio 1: Crear un post con los datos del fixture POST.json
    // Método: POST /posts
    // Se espera: status 201, que devuelva un id, y que los datos coincidan
    it('Crea un post correctamente', function () {

    })

    // Ejercicio 2: Actualizar un post existente con los datos del fixture PUT.json
    // Método: PUT /posts/1
    // Se espera: status 200, que el id siga siendo 1, y que los datos se actualicen
    it('Actualiza un post correctamente', function () {

    })

    // Ejercicio 3: Borrar un post
    // Método: DELETE /posts/1
    // Se espera: status 200 o 204, y cuerpo vacío {}
    it('Borra un post correctamente', function () {

    })

    // Ejercicio 4: Filtrar posts por userId usando query params
    // Método: GET /posts?userId=1
    // Se espera: status 200, que sea un array, y que todos los posts tengan userId = 1
    it('Obtiene posts filtrados por userId', function () {

    })
})