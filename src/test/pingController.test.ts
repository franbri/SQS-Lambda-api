
import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda"
import { Controller, GET, Use, Schedule, POST } from "lambaa"
import {
  createAPIGatewayEvent,
  createAPIGatewayProxyEvent,
  createLambdaContext as createLambdaContext,
  createScheduledEvent,
  createSQSEvent,
} from "./testUtil"
import { Router } from "lambaa"
//import { handler } from "../index"
@Controller()
class TestController {
  @GET("/ping")
  public pingtest(): Promise<APIGatewayProxyResult> {
      return new Promise((res) =>
          res({
              statusCode: 200,
              body: "ponggg"
          })
      )
  }
}
const router = new Router().registerControllers([
    new TestController()])

const handler = router.getHandler<APIGatewayProxyEvent, APIGatewayProxyResult>()

const context = createLambdaContext()

describe("test ping", () => {
    it("routes http get event when method returns promise", async () => {
        const event = createAPIGatewayEvent({
            resource: "/ping",
            method: "GET",
        })

        const response = await handler(event, context)

        expect(response.statusCode).toBe(200)
        expect(response.body).toBe("ponggg")
    })
})