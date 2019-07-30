const express = require("express");
const bodyparser = require('body-parser');
const morgan = require("morgan");

const usersRouters = require('./api/routes/users');
const OTPRouters = require('./api/routes/otps');

const app = express();
app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin" , "*");
    res.header("Access-Control-Allow-Headers" , "Origin , X-Requested-With , Content-Type , Accept , Authorization");
    if(req.method === 'OPTIONS'){
    res.header("Access-Control-Allow-Methods" , 'PUT , POST , PATCH , DELETE , GET');
    //return res.sendStatus(200).json({});
}
next();
});

app.use('/users' , usersRouters);
app.use('/otps' , OTPRouters);

app.use((req,res,next) => {
    const error = new Error('Not Found');
    error.status(400);
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message
        }
    });
});


app.get('/' , (req , res) => 
res.send('INDEX')
);

const PORT = process.env.PORT || 4000;

app.listen(PORT , console.log(`Server Listening on PORT ${PORT}`));