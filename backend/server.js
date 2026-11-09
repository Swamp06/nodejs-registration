
import express from "express";
import mongoose from "mongoose";
import routeUser from "./routes/routeUser.js"; 
import router from "./routes/router.js";
import fileUpload from "express-fileupload";
import {fileURLToPath} from "url"
import path from "path";
import cors from "cors";

const __fileName = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__fileName)

const PORT = 5000;

const app = express();
app.use(cors())
app.use(express.json());
app.use(fileUpload({}))

app.use("/files" , express.static(path.resolve(__dirname , "files")))

app.use(routeUser)
app.use(router)


mongoose
  .connect("mongodb://localhost:27017/Computers")
  .then(() => {
    console.log("Успешное подключение к БД");
  })
  .catch((error) => {
    console.log("Ошибка при подключении к БД: " + error);
  });

app.listen(PORT , ()=>{
  console.log("Сервер успешно запущен на порту" , PORT);
  
})