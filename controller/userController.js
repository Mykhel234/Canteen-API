const userModel = require("../models/userModel");
const verifiedModel = require("../models/verifiedModel");
const cloudinary = require("../utils/cloudinary");
const transport = require("../utils/email");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res) => {
	try {
		const user = await userModel.find();
		res.status(200).json({
			message: "success",
			data: user,
		});
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const getSingleUser = async (req, res) => {
	try {
		const user = await userModel.findById(req.params.id);
		res.status(200).json({
			message: "success",
			data: user,
		});
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};
const deleteSingleUser = async (req, res) => {
	try {
		const user = await userModel.findByIdAndDelete(req.params.id);
		res.status(200).json({
			message: "success"
		});
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const editSingleUser = async (req, res) => {
	try {
		const { fullName, phone, email } = req.body;

		const user = await userModel.findOne({ email });
		if (user) {
			await cloudinary.uploader.destroy(user.avatarID);
			const image = await cloudinary.uploader.upload(req.file.path);
			const mainUser = await userModel.findByIdAndUpdate(
				req.params.id,
				{
					fullName,
					phone,
					avatar: image.secure_url,
					avatarID: image.public_id,
				},
				{ new: true }
			);
			res.status(200).json({
				message: "success",
				data: mainUser,
			});
		} else {
			res.status(404).json({
				message: error.message,
			});
		}
	} catch (error) {
		res.status(404).json({
			message: error.message,
		});
	}
};

const createUser = async(req, res)=>{
    try {
        const {email, password, name, phone} = req.body

        const salt = await bcrypt.genSalt(20)
         const hashed = await bcrypt.hash(password, salt)
         const image = cloudinary.uploader.upload(req.file.path)
         const tokenValue = crypto.randomBytes(64).toString("hex")
         const mytoken = jwt.sign( {tokenValue}, "ecommercesecretpass", {expiresIn:"28d"})

         const user = await userModel.create({ 
           name,
           email,
		   password:hashed,
           phone,
           avatar: image.secure_url,
           avatarID:image.public_id,
           verifiedToken:mytoken
         })

         await verifiedModel.create({ 
    token:mytoken,
    userID:user._id,
    _id:user._id
         })

         const mailOptions={ 
             from :"deetech196@outlook.com", 
             to: email, 
             subject:"Account Verification",
             html:`<h6> Thank you for succesfully signing up with us ${user.name} pleae follow nthe link <a href="http://localhost:1999/api/user/${user._id}/${mytoken}">Link to complete your sign up</a></h6>
             `
         }
         transport.sendMail(mailOptions, (err, info)=>{
             if(err){
                 console.log(err .message)
             }else{
				 console.log("Email sent ", info.response) 
			 }
         })
		 res.status(201).json({
			message: "Check your inbox to continue...!",
		});
    } catch (error) {
        console.log(error.message)
    }
}

const verifyUser = async(req,res)=>{
 try{
	 const user = await userModel.findById(req.params.id)

	 if(user){
		 if(user.verifiedToken !== ""){
			 await userModel.findByIdAndUpdate(user._id,{
       isVerify:true,
	   verifiedToken:""
			 }, {new:true})
			 await verifiedModel.findByIdAndUpdate(user._id, {
  token:"",
  userID:user._id

			 },
			 {new:true}
			 )
			 res.status(201).json({
				message: "Verification complete, you can go sign in now!",
			});
		 }else{
			 	res.status(404).json({
					message: error.message,
				});
		 }

	 }else{
		res.status(404).json({
			message: error.message,
		});
	 }

 }catch(error){
	 console.log(error.mesage)
 }
}

const createAdmin = async(req, res)=>{
	try{
		const { email, password, name, phone } = req.body
		const salt = await bcrypt.genSalt(10)
		const hashed = await bcrypt.hash(password, salt)
		const image = await cloudinary.uploader.upload(req.file.path);

		const myToken = crypto.randomBytes(64).toString("hex")
		const adminToken = crypto.randomBytes(5).toString("hex")

		const Tokenval = jwt.sign({myToken}, "ecommercesecretpass", {expiresIn:"28d"})


		const user = await userModel.create({
			email, 
			password: hashed,
			name, 
			phone,
			avatar:image.secure_url,
			avatarID:image.public_id,
			verifiedToken:Tokenval, 
			OTP:adminToken
		})
		await verifiedModel.create({ 
         token:Tokenval,
		 userID:user._id,
		 _id:user._id
		})
const mailOptions={
	from :"deetech196@outlook.com",
	subject: "Account Verification",
	to:email, 
	html:` <h3>
	Thanks for sign up with us ${user.name}, Please use the <a
	href="http://localhost:3000/admin/${user._id}/${myToken}"
	>Link to complete your sign up use your secret key to complete this sign up: </a><h2><strong>${adminToken}</strong></h2> 
	</h3>`
}
transport.sendMail(mailOptions , (err, info)=>{
 if(err){
	console.log(err);

 }else{
	console.log("Email has been sent to your inbox", info.response);
 }
})
res.status(201).json({
	message: "Check your inbox to continue...!",
});
	}catch(error){
		console.log(error.message)
	}
}

const verifyAdmin = async(req, res)=>{
	try{
  const {mainOTP} = req.body
  const user = await userModel.findById(req.params.id)

  if(user){
	  if(user.OTP === mainOTP){
		  await userModel.findByIdAndUpdate(user._id,{
isVerify:true,
isAdmin:true,
verifiedToken:"",
OTP:""
		  }, {new:true})
		  await verifiedModel.create( user._id,{
  userID:user._id,
  token :""
		  }, {new:true})
		  res.status(201).json({
			message: "Verification complete, you can go sign in now!",
		});
	  }else{
		res.status(404).json({
			message: "failed",
		});
	  }
  }else{
	res.status(404).json({
		message: "failed",
	});
  }
	}catch(error){
		console.log(error.message)
	}
}

const signinUser = async(req, res)=>{
	try{
const {email , password} = req.body

const user = await userModel.findOne({email})

if(user){
	const check = await bcrypt.compare(password, user.password)
	if(check){
		if(user.isVerify){
			const token = jwt.sign({
				id:user._id,
				isVerify:user.isVerify,
				isAdmin:user.isAdmin 
			},
			"ecommercesecretpass", {expiresIn:"28d"}
			)
			const {password, ...info} =user._doc
			res.status(201).json({
				message: `Welcome back ${user.name}`,
				data: { token, ...info },
			});
		}else{
      if(user.OTP !==""){
		  const tokenValue = crypto.randomBytes(64).toString("hex")

		  const adminToken= crypto.randomBytes(5).toString("hex")

		  const myToken = jwt.sign({
			  tokenValue,

		  }, "ecommercesecretpass", {expiresIn:"29d"})

		  const mailOptions= {
			  from :"deetech196@outlook.com",
			  to:email,
			  subject:"Account Verification",
			  html:`
			  <h3>
			  Thanks for sign up with us ${user.name}, Please use the <a
			  href="http://localhost:1999/api/user/admin/${user._id}/${myToken}"
			  >Link to complete your sign up use your secret key to complete this sign up: </a><h2><strong>${adminToken}</strong></h2> 
			  </h3>
			  `
		  }

		  transport.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.log(err);
			} else {
				console.log("Email has been sent to your inbox", info.response);
			}
		});
	  }else{
		  const tokenValue = crypto.randomBytes(64).toString("hex")
		  const myToken = jwt.sign({
			  tokenValue
		  },  "ecommercesecretpass", {expiresIn:"29d"} )
		  const mailOptions = {
			from: "deetech196@outlook.com",
			to: email,
			subject: "re-verification of your Account ",
			html: `
<h3>
Thanks for sign up with us ${user.name}, Please use the <a
href="http://localhost:1999/api/user/${user._id}/${myToken}"
>Link to complete your sign up</a> for re-verification of your account
</h3>
`,
		};
		transport.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.log(err);
			} else {
				console.log("Email has been sent to your inbox", info.response);
			}
		});
 
		res.status(201).json({
			message: "Check your inbox to continue...!",
		});
	  }
		}
	}else{
		res.status(404).json({
			message: "failed",
		});
	}
}else{
	res.status(404).json({
		message: "failed",
	});
}
	}catch(error){
		console.log(error.message)
	}
}

module.exports={
	
		editSingleUser,
		getAllUsers,
		getSingleUser,
		createUser,
		verifyUser,
		createAdmin,
		verifyAdmin,
		deleteSingleUser,
		signinUser
}