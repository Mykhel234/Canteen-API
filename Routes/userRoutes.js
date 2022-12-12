const express = require("express");
const {
	getAllUsers,
	getSingleUser,
	editSingleUser,
	createUser,
	verifyUser,
	signinUser,
	createAdmin,
	verifyAdmin,
	deleteSingleUser 
} = require("../controller/userController");
// const verification =require("../controller/authorize")
const {upload} = require("../utils/multer");    
const router = express.Router()
   
router.route("/register").post(upload, createUser);
router.route("/:id/:token").get(verifyUser);
router.route("/").get(getAllUsers);
router.route("/admin/:id/:token").post(verifyAdmin);
router.route("/registerAdmin").post(upload, createAdmin);
router.route("/:id").get(getSingleUser).patch(editSingleUser);
router.route("/:id").delete(deleteSingleUser)

router.route("/signin").post(signinUser); 
    






module.exports = router;
