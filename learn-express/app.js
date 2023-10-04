
const express=require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require('path');
const multer = require("multer");
dotenv.config();
const app = express();
const fs = require('fs');
try{
    fs.readdirSync('uploads');
}catch(error){
    console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
    fs.mkdirSync("uploads");
}
const upload = multer({
    storage: multer.diskStorage({
        destination(req,file,done){
            done(null, "uploads/")
        },
        filename(req,file, done){
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext)+Date.now()+ext);

        },
    }),
    limits:{fileSize:5*1024*1024}
})
app.set('port', process.env.PORT || 3000);
app.use(morgan("dev"));
app.use('/', express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret: process.env.COOKIE_SECRET,
    cookie:{
        httpOnly: true,
        secure: false,
    },
    name:"session-cookie",
}));
app.use((req,res,next)=>{
    console.log("모든 요청은 다 실행됩니다.");
    next();
})