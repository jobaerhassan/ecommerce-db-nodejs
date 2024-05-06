const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const createError = require('http-errors')
const rateLimit = require('express-rate-limit');
const userRouter = require("./routers/userRouters");
const seedUser = require("./controllers/seedController");
const seedRouter = require("./routers/seedRouter");
const { errorResponse } = require("./controllers/responseController");

const rateLimiter = rateLimit({
    windowMs: 1*60*1000, // 1 minute to mili
    max: 5,
    message: 'Too many requests from this IP. please try again later'
})
app.use(morgan('dev'));
app.use(rateLimiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//using api from routers

app.use("/api/users" ,userRouter);
app.use("/api/seed", seedRouter);

app.get('/api/products', (req,  res) => {
    console.log(req.body.id)
    res.send("good");
} )


//client error handling
app.use((req, res, next)=>{
    next(createError(404, "Route not found"));
})

//server error handling
app.use((err, req, res, next) => {
    return errorResponse(res, {statusCode: err.status, message: err.message});
})

module.exports = app;