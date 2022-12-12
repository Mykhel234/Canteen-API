const express = require("express");
const {
    getAllwatch, 
    getOnewatch,
    updateOne,
    createOne,
    deletePost
	 
} = require("../controller/friesController");
const verification =require("../controller/authorize")
const {imageUpload} = require("../utils/multer");    
const router = express.Router()
   
router.route("/:id/create").post(verification,imageUpload, createOne);

router.route("/:id/").get(verification,getAllwatch); 


router.route("/:id/getone/:Id").get(verification, getOnewatch).patch(verification,imageUpload, updateOne).delete(verification,deletePost);


    






module.exports = router;
