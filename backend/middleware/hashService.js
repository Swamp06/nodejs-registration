import bcrypt from "bcrypt"


class HashService{
    async hashPassword(password){
        try {
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password , salt)
            return hash
            
        } catch (err) {
            
        }
    }
}

export default new HashService()