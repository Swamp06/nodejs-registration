import mongoose, { Mongoose } from "mongoose";


const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true , "Имя не может быть пустым!"],
    },
    lastName:{
        type: String,
        required: [true , "Фамилия не может быть пустой!"],
    },
    phoneNumber:{
        type: String,
    },
    email:{
        type: String ,
        required: [true , "Почта не может быть пустой!"],
        match: [/^\S+@\S+\.\S+$/ , "Введите корректный email"],
        unique: true,

    },
    password:{
        type: String,
        required: [true , "Пароль не может быть пустым!"],
        minLength: [6 , "Минимальная длина пароля 6 символов"]
    }
})

export default mongoose.model("User" , UserSchema);