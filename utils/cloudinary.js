const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
	cloud_name: "dicksoneneh",
	api_key: "439985612445895",
	api_secret: "jKWjiy4WbATVWyCd21GX11NwFKY", 
	secure: true,
});

module.exports = cloudinary;
