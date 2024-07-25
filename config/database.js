const mongoose = require('mongoose');

module.exports.connect = async() =>{   
    try {
        await mongoose.connect(process.env.MONGOOSE_URL);
        console.log("Connect Successfully");
    } catch (error) {
        console.error(error);
        console.log("Error connecting");
    }
}