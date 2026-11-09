import { Router } from "express"
import ComputerController from "../controllers/ComputerController.js"

const router = new Router()


router.get("/computers" , ComputerController.getComputers )
router.post("/addComputer" , ComputerController.addComputer)
router.get("/computers/:id" , ComputerController.getComputer)
router.delete("/deletecomputer/:id" , ComputerController.deleteComputer)
router.patch("/updatecomputer/:id" , ComputerController.updateComputer)


export default router;