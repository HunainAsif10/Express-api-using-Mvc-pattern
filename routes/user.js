import express from "express"
import { createUser, deleteUser, loginUser, updateUser } from "../controllers/user.js";
import { fetchAndAuthenticate } from "../middleware/fetchUser.js";
const router =express.Router()


// createUser
router.post('/createUser',createUser)
// loginUser
router.post('/loginUser',loginUser)
// updateUser
router.put("/updateUser/:id",fetchAndAuthenticate,updateUser)
// deleteUser
router.delete("/deleteUser/:id",fetchAndAuthenticate,deleteUser)
export default router;