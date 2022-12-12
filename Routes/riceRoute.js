const express = require("express");
const {
    getAllUsers, 
    getOneUser,
    updateOne,
    createOne,
    deletePost
	 
} = require("../controller/riceController");
const verification =require("../controller/authorize")
const {imageUpload} = require("../utils/multer");    
const router = express.Router()
   
router.route("/:id/create").post(verification,imageUpload, createOne);
 
router.route("/:id/").get(verification,getAllUsers); 


router.route("/:id/getone/:Id").get(verification, getOneUser).patch(verification,imageUpload, updateOne).delete(verification, deletePost);


    






module.exports = router;
