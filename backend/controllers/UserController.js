import hashService from "../middleware/hashService.js"
import User from "../models/User.js"

class UserController{
    async registration(req, res){
        const {name , lastName , phoneNumber , email , password} = req.body
        
        const hashPassword = await hashService.hashPassword(password)
        console.log(hashPassword);
        
        const user = await User.create({name , lastName , phoneNumber , email , password: hashPassword})
        
        res.json(user)
    }
}

export default new UserController()