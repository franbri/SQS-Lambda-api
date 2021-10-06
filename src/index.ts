import { Router } from "lambaa"
import pingController from "./controllers/pingController"

console.log("hola nico")

const router = new Router().registerController(new pingController())

export const handler = router.getHandler()
