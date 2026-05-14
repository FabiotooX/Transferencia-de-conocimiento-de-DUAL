package ejercicios;

import example.BaseSimulation;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

import io.gatling.javaapi.core.*;

public class EjemploSimulation extends BaseSimulation {

        private ScenarioBuilder scn = scenario("CRUD JSONPlaceholder")
                        .exec(http("GET /posts — todos los posts")
                                        .get("/posts")
                                        .check(status().is(200)))
                        .pause(1)

                        .exec(http("GET /posts/1 — post específico")
                                        .get("/posts/1")
                                        .check(status().is(200)))
                        .pause(1)

                        .exec(http("GET /posts/1/comments — comentarios del post")
                                        .get("/posts/1/comments")
                                        .check(status().is(200)))
                        .pause(1)

                        .exec(http("GET /comments?postId=1 — filtrar comentarios")
                                        .get("/comments?postId=1")
                                        .check(status().is(200)));

        {
                // Llamamos al perfil de inyección configurado en BaseSimulation
                // desde este archivo donde se va a ejecutar
                setupSimulation(scn);
        }
}