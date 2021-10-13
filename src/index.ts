import { Router } from "lambaa"
import pingController from "./controllers/pingController"
import queueController from "./controllers/queueController"
import messageController from "./controllers/messageController"

const router = new Router().registerControllers([
    new pingController(),
    new queueController(),
    new messageController()])

export const handler = router.getHandler()
