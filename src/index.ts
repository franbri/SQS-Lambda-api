import { Router } from "lambaa"
import pingController from "./controllers/PingController"

const router = new Router().registerController(new pingController())

export const handler = router.getHandler()
