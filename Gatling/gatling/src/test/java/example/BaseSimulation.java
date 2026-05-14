package example;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

import io.gatling.javaapi.core.*;
import io.gatling.javaapi.http.*;

public abstract class BaseSimulation extends Simulation {

    protected HttpProtocolBuilder httpProtocol = http
            .baseUrl("https://jsonplaceholder.typicode.com")
            .acceptHeader("application/json")
            .contentTypeHeader("application/json")
            .userAgentHeader("Gatling Load Test");

    protected void setupSimulation(ScenarioBuilder scenario) {
        setUp(scenario.injectOpen(atOnceUsers(20))).protocols(httpProtocol);
    }
}
