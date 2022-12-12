const express = require("express");
const {
    getAllShoe, 
    getOneShoe,
    updateOne,
    createOne,
    deletePost
	 
} = require("../controller/soupController");
const verification =require("../controller/authorize")
const {imageUpload} = require("../utils/multer");    
const router = express.Router()
   
router.route("/:id/create").post(verification,imageUpload, createOne);

router.route("/:id/").get(verification,getAllShoe);  


router.route("/:id/getone/:Ids").get(verification, getOneShoe).patch(verification,imageUpload, updateOne).delete(verification, deletePost);


    






module.exports = router;
