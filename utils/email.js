const nodemailer = require("nodemailer")

const transport = nodemailer.createTransport({
    service:"hotmail",
    auth:{
        user:"deetech196@outlook.com",
        pass:"0perandu5"
    }
})

module.exports =transport 