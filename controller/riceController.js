const riceModel = require("../models/riceModel")
const cloudinary =require("../utils/cloudinary")
const userModel = require("../models/userModel")
                                                                                          

const getAllUsers= async(req, res)=>{
try {
    const getAll = await riceModel.find()
    res.status(200).json({
        status:"succes",
        data:getAll
    })
} catch (error) {
    console.log(error.message)
}
}

const getOneUser= async(req, res)=>{
    try {
        const Id = req.params.Id
        const getOne = await riceModel.findById(Id)
        res.status(200).json({
            status:"succes",
            data:getOne
        })
    } catch (error) {
        console.log(error.message)
    }
    }

    const updateOne = async (req, res) => {
        try {
            const Id = req.params.Id
            const {productName, productBrand, description, price} = req.body
            // const cloudImage= await cloudinary.uploader.destroy(req.file.path)
            const cloudImages= await cloudinary.uploader.upload(req.file.path)

            const patching = await riceModel.findByIdAndUpdate(Id, {
                productName,
                 productBrand, 
                 description,
                  price,
                  image:cloudImages.secure_url,
                  imageID:cloudImages.public_id
  
            }, {new:true})

            res.status(201).json({
                status:"updated",
                data:patching
            })
        } catch (error) {
            console.log(error.message)
        }
    } 
    const createOne = async (req, res) => {
        try {
            const Id = req.params.id
            const {productName, productBrand, description, price} = req.body
            const user =  await userModel.findById(Id)
            // res.status(200).json({show: user})
            if(user.isAdmin){
               
                const cloudImage= await cloudinary.uploader.upload(req.file.path)
              const users = await userModel.findById(req.params.id)
              const content = new riceModel({
                productName,
                 productBrand, 
                 description,
                  price  ,
                  image:cloudImage.secure_url,
                  imageID:cloudImage.public_id       
              })
              users.items.push(content)
              users.save()
              content.user = users
              content.save()
    
                res.status(201).json({
                    status:"created",
                    data:content
                })
            }else{
                res.status(404).json({
                   status:"ytou cannot carry out this operation"
                })
            }
           
        } catch (error) {
            console.log(error.message)
        }
    } 
    
const deletePost = async (req, res) => {
	try {
		const postData = await userModel.findById(req.params.id);
		const remove = await riceModel.findByIdAndRemove(req.params.Id);

		postData.items.pull(remove);
		postData.save();

		res.status(200).json({ message: "post deleted" });
	} catch (error) {
		res.status(404).json({ message: error.message });
	}
};

module.exports ={
    getAllUsers, 
    getOneUser,
    updateOne,
    createOne,
    deletePost
    
}