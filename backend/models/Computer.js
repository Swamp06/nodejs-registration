import mongoose from "mongoose"

 const computerSchema = new mongoose.Schema({
    gpu: {
        type: String,
        required: true, 
        trim: true
    },
    cpu: {
        type: String,
        required: true, 
        trim: true
    },
    motherboard: {
        type: String,
        required: true, 
        trim: true
    }, 
    ram: {
        type: String,
        required: true, 
        trim: true
    },
    cooler:{
        type: String,
        required: true, 
        trim: true
    },
    memory:{
        type: String,
        required: true, 
        trim: true
    },
    image:{
        type: String,
        required: false
    }
    
    
 })

export default mongoose.model("Computer" , computerSchema);