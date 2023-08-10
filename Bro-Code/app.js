const Express = require('express');
require('dotenv').config();
const dbConnect = require('./startup/dbConnect');
const morgan = require('morgan')
const PORT = process.env.PORT ||3000
const app = Express();
const userRouter = require('./routes/userRoutes')



app.use(morgan("dev"))
app.use(Express.json())
app.use('/api/v1',userRouter)



dbConnect();




app.listen(PORT,()=>{
    console.log(`server is up and running at http://127.0.0.1:${PORT}`);
})