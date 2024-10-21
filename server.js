//Pacotes

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const ejs = require('ejs');
const morgan = require('morgan');


//Start
const app = express();

// Variaveis Ambiente
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const PORT = process.env.PORT || 3000;

//Arquivos Estaticos
app.use("/public", express.static((__dirname + '/public')));
app.use("/public/images", express.static((__dirname + '/public/images')));

//MongoDb Setup
const dbs = require('./config/database');
const compression = require('compression');
const dbURI = isProduction ? dbs.dbProduction : dbs.dbTest;
mongoose.connect(dbURI, {
    useNewUrlParser: true,
})

app.use(express.json());


//Setup EJS
app.set('view engine', 'ejs');

//Configuracoes
if(!isProduction) app.use(morgan('dev'));
    app.use(cors());
    app.disable('x-powered-by');
    app.use(compression());

//Setup Body Parser  
app.use(bodyParser.json({limit: 1.5 * 1024 * 1024}));
app.use(bodyParser.urlencoded({
    extended: false,
    limit: 1.5 * 1024 * 1024
}));
 

//Chamada dos Models
require('./models');

//Chamada dos Routes
app.use('/',require('./routes'));
//Configurando rota 404
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

//Configuracao de rotas 422,500,401
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    if(err.status !== 404) console.warn("Error",err.message , new Date());
    res.json({
        error: {
            message: err.message,
            status: err.status
        }
    })
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
    





