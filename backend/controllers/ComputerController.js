import Computer from "../models/Computer.js";
import ComputerfileService from "../middleware/ComputerfileService.js";

class ComputerController {
  async getComputers(req, res) {
    try {
      const computers = await Computer.find();
      res.json(computers);
      console.log(computers);
    } catch (error) {
      console.log("Ошибка при получении компьютеров: " + error);
    }
  }

  async addComputer(req, res) {
    try {
      
       let fileName = null;
        console.log(req.files.image);
        
       if(req.files && req.files.image){
        fileName  = await ComputerfileService.saveFile(req.files.image)
        if(!fileName){
         return res.send("Ошибка при добавлении файла "  , fileName )
        }
        
       }
      
      const { gpu, cpu, motherboard, ram, cooler, memory, } = req.body;
      const newComputer = await Computer.create({
        gpu,
        cpu,
        motherboard,
        ram,
        cooler,
        memory,
        image: fileName
      });

      await newComputer.save();
      res.send("Продукт успешно добавлен!");
    } catch (error) {
      
      console.log("Ошибка при добавлении компьютера: " + error);
    }
  }

  async getComputer(req , res){
    try {
      let { id } = req.params
      const computer = await Computer.findById(id)
      res.json(computer)
    } catch (error) {
      console.log("Ошибка при получении компьютера: " + error);
    }
    
  }

  async deleteComputer(req , res){
    try {
      let { id } = req.params
      
      const computer = await Computer.findByIdAndDelete(id)
      if (!computer) {
        res.send("Компьютер не найден")
      }
      res.send("Компьютер успешно удален")
    } catch (error) {
      console.log("Ошибка при удалении компьютера: " + error);
    }
    
  }

  async updateComputer(req , res){
    try {
      let { id } = req.params
      console.log(id);
      const { gpu, cpu, motherboard, ram, cooler, memory, } = req.body;
      
      const computer = await Computer.findByIdAndUpdate(id , {
        gpu,
        cpu,
        motherboard,
        ram,
        cooler,
        memory
      })
      if (!computer) {
        res.send("Компьютер не найден")
      }
      res.send("Компьютер успешно обновлен")
    } catch (error) {
      console.log("Ошибка при обновлении компьютера: " + error);
    }
    
  }

}

export default new ComputerController();
