const soupModel = require("../models/soupModel")
const cloudinary =require("../utils/cloudinary")
const userModel = require("../models/userModel")
                                                                                          

const getAllShoe= async(req, res)=>{
try {
    const getAll = await soupModel.find()
    res.status(200).json({
        status:"succes",
        data:getAll
    })
} catch (error) {
    console.log(error.message)
}
}

const getOneShoe= async(req, res)=>{
    try {
        const Ids = req.params.Ids
        const getOne = await soupModel.findById(Ids)
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
            const Ids = req.params.Ids
            const {productName, productBrand, description, price} = req.body
            const cloudImage= await cloudinary.uploader.upload(req.file.path)
            const patching = await soupModel.findByIdAndUpdate(Ids, {
                productName,
                 productBrand, 
                 description,
                  price,
                  image:cloudImage.secure_url,
                  imageID:cloudImage.public_id
  
            }, {new:true
            })

            res.status(200).json({
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
              const users = await userModel.findById(Id)
              const content = new soupModel({
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
                    status:"updated",
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
            const remove = await soupModel.findByIdAndRemove(req.params.Ids);
    
            postData.items.pull(remove);
            postData.save();
    
            res.status(200).json({ message: "post deleted" });
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    };
module.exports ={
    getAllShoe, 
    getOneShoe,
    updateOne,
    createOne,
    deletePost
}