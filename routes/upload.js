const router = require('express').Router();
var express = require('express');
const Pin = require('../models/pin-model');
const User = require('../models/user-model');
var Jimp = require('jimp');
var app = express();

var multer=require('multer');
var path =require('path');
var ejs= require('ejs');
var bodyParser = require('body-parser');

app.set('views', __dirname+'../views');
app.set('view engine' , 'ejs');

app.use(express.static('/views'));

var thumbnailPath;
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        var abc = Date.now();
        var imgname='myImage-'+abc+path.extname(file.originalname);
        thumbnailPath=imgname;
        cb(null, file.fieldname + '-' +abc + path.extname(file.originalname));
    }
})
var upload = multer({ storage: storage, limits: { fileSize: 100000000 } });

var urlencodedParser = bodyParser.urlencoded({ extended: false })
router.get('/', (req, res) => {
    if(req.user)
        res.render('uploadimg', {user: req.user});
    else
        res.redirect('/auth/github');
});

router.post('/',urlencodedParser, upload.single('myImage'), (req, res)=> {
    Jimp.read("./public/uploads/"+thumbnailPath, (err, lenna) => {
        if (err) throw err;
        lenna
            .resize(Jimp.AUTO, 500) // resize
            .quality(100) // set JPEG quality
            //.greyscale() // set greyscale
            // .scaleToFit(300,300); // scale the image to the largest size that fits inside the given width and height
            .write("./public/uploads/"+thumbnailPath); // save
    });
    new Pin({
        pinName: req.body.pinName,
        pinDesc: req.body.pinDescreption,
        pinUId: req.user._id,
        pinUser: req.user.githubUserName,
        thumbnail: thumbnailPath
    }).save().then((newPin)=> {
        User.findOne({_id : req.user._id}, (err, user)=>{
            if(err) throw err;
            if(user) {
                user.pinID.push(newPin._id);
                user.save((err, updatedUser)=>{
                    if(err) throw err;
                    console.log('user updated');
                })
            }
        });
    });
    console.log('Pin created :',req.body);
    res.redirect('/');
});

module.exports = router;
