
import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./database/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB()
.then(()=>{
  app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    app.on("error", (error) => {
        console.error("Express error:", error);
    });
})
.catch((error)=>{
  console.log("Error connecting to db: ",error);
})
