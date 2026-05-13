/// <reference types="cypress" />

// IMPORTANTE: En cypress.config.js hemos definido:
//   baseUrl: 'https://jsonplaceholder.typicode.com'

// Gracias a esto, en cy.request() podemos usar rutas RELATIVAS (ej: '/posts')
// en lugar de escribir la URL completa cada vez. Cypress concatenará
// automáticamente la baseUrl + la ruta relativa.

describe('CRUD completo contra JSONPlaceholder API', () => {

  // Test 1: Obtener todos los posts
  // cy.request() realiza una petición HTTP real
  // .then() nos permite trabajar con el objeto 'response' que contiene:
  //   - response.status  → código HTTP (200, 201, 404, etc.)
  //   - response.body    → cuerpo de la respuesta (ya parseado como JSON)
  //   - response.headers → cabeceras de la respuesta
  //   - response.duration → tiempo que tardó la petición (ms)

  it('GET /posts — debe devolver 100 posts', () => {
    cy.request('/posts').then((response) => {
      // Verificamos que el servidor respondió con 200 (OK)
      expect(response.status).to.eq(200)

      // La API devuelve un array de 100 posts; comprobamos la longitud
      expect(response.body).to.be.an('array')
      expect(response.body).to.have.length(100)

      // Verificamos que cada post tiene la estructura esperada
      // Usamos el primer elemento como muestra representativa
      const primerPost = response.body[0]
      expect(primerPost).to.have.all.keys('userId', 'id', 'title', 'body')
    })
  })

  // Test 2: Obtener un post específico por su ID
  // Cuando añadimos '/posts/1' estamos pidiendo el post con id = 1.
  // Esto demuestra cómo acceder a un recurso individual en una API REST.

  it('GET /posts/1 — debe devolver el post con id 1', () => {
    cy.request('/posts/1').then((response) => {
      expect(response.status).to.eq(200)

      // Comprobamos que el id del post devuelto sea exactamente 1
      expect(response.body).to.have.property('id', 1)

      // Verificamos que el post pertenece al usuario 1
      expect(response.body).to.have.property('userId', 1)

      // Comprobamos que 'title' y 'body' existen y no están vacíos
      expect(response.body.title).to.be.a('string').and.not.be.empty
      expect(response.body.body).to.be.a('string').and.not.be.empty
    })
  })

  // Test 3: Obtener los comentarios de un post (relación anidada)
  // La ruta '/posts/1/comments' demuestra cómo las APIs REST modelan
  // relaciones entre recursos: un post TIENE muchos comentarios.

  it('GET /posts/1/comments — debe devolver 5 comentarios del post 1', () => {
    cy.request('/posts/1/comments').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.length(5)

      // Verificamos que TODOS los comentarios pertenecen al post 1
      // .each() de Chai itera sobre cada elemento del array
      response.body.forEach((comentario) => {
        expect(comentario).to.have.property('postId', 1)
      })

      // Comprobamos que cada comentario tiene un email válido
      response.body.forEach((comentario) => {
        expect(comentario).to.have.property('email').that.includes('@')
      })
    })
  })

  // Test 4: Filtrar comentarios por query parameter
  // En vez de usar la ruta anidada '/posts/1/comments', aquí usamos un
  // query parameter: '/comments?postId=1'. Ambos devuelven lo mismo,
  // pero demuestran dos formas distintas de filtrar en una API REST.

  it('GET /comments?postId=1 — filtrar comentarios con query params', () => {
    cy.request({
      method: 'GET',
      url: '/comments',
      // 'qs' (query string) añade los parámetros a la URL automáticamente
      // Esto genera: /comments?postId=1
      qs: {
        postId: 1
      }
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.have.length(5)

      // Comprobamos que el filtro funcionó: todos deben tener postId = 1
      response.body.forEach((comentario) => {
        expect(comentario.postId).to.eq(1)
      })
    })
  })

  // Test 5: Crear un nuevo post
  // cy.request() acepta un objeto de configuración donde especificamos:
  //   - method: el verbo HTTP (GET, POST, PUT, PATCH, DELETE)
  //   - url: la ruta relativa (se concatena con baseUrl)
  //   - body: el cuerpo de la petición (Cypress lo serializa a JSON automáticamente)

  it('POST /posts — debe crear un nuevo post', () => {
    // Datos del nuevo post que queremos crear
    const nuevoPost = {
      title: 'Post de prueba desde Cypress',
      body: 'Este post fue creado durante la demostración en clase.',
      userId: 1
    }

    cy.request({
      method: 'POST',
      url: '/posts',
      body: nuevoPost
    }).then((response) => {
      // En una API REST, la creación exitosa devuelve 201 (Created)
      expect(response.status).to.eq(201)

      // Verificamos que el servidor devolvió los datos que enviamos
      expect(response.body).to.have.property('title', nuevoPost.title)
      expect(response.body).to.have.property('body', nuevoPost.body)
      expect(response.body).to.have.property('userId', nuevoPost.userId)

      // El servidor debe asignar un id al nuevo recurso
      // JSONPlaceholder siempre devuelve id = 101 (ya tiene 100 posts)
      expect(response.body).to.have.property('id')
      expect(response.body.id).to.be.a('number')
    })
  })

  // Test 6: Actualizar un post completo con PUT
  // PUT reemplaza el recurso COMPLETO. Debemos enviar TODOS los campos,
  // incluso los que no cambian. Si omitimos un campo, se pierde.

  it('PUT /posts/1 — debe actualizar el post completo', () => {
    const postActualizado = {
      id: 1,
      title: 'Título actualizado con PUT',
      body: 'Contenido completamente reemplazado.',
      userId: 1
    }

    cy.request({
      method: 'PUT',
      url: '/posts/1',
      body: postActualizado
    }).then((response) => {
      expect(response.status).to.eq(200)

      // Verificamos que el título se actualizó correctamente
      expect(response.body).to.have.property('title', postActualizado.title)
      expect(response.body).to.have.property('body', postActualizado.body)
    })
  })

  // Test 7: Actualizar parcialmente un post con PATCH
  // PATCH solo modifica los campos que enviamos.
  // A diferencia de PUT, no necesitamos enviar todos los campos.

  it('PATCH /posts/1 — debe actualizar solo el título', () => {
    cy.request({
      method: 'PATCH',
      url: '/posts/1',
      body: {
        title: 'Solo el título cambia con PATCH'
      }
    }).then((response) => {
      expect(response.status).to.eq(200)

      // El título debe haberse actualizado
      expect(response.body).to.have.property('title', 'Solo el título cambia con PATCH')

      // Los demás campos deben seguir existiendo (no se eliminan con PATCH)
      expect(response.body).to.have.property('body')
      expect(response.body).to.have.property('userId')
      expect(response.body).to.have.property('id', 1)
    })
  })

  // Test 8: Eliminar un post
  // DELETE elimina un recurso. La API devuelve 200 con un cuerpo vacío.

  it('DELETE /posts/1 — debe eliminar el post', () => {
    cy.request({
      method: 'DELETE',
      url: '/posts/1'
    }).then((response) => {
      // El servidor confirma la eliminación con un 200
      expect(response.status).to.eq(200)
    })
  })
})