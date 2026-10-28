require("dotenv").config();
const app = require("./src/app")
const db = require("./src/database/db")
db()

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`)
})