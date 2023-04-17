var express = require('express');
const bodyparser = require('body-parser');
const expressHbs = require('express-handlebars')
var app = express();
const multer = require('multer');
app.use(bodyparser.urlencoded({extended:true}))
app.use('/image',express.static('image'))
app.engine('.hbs', expressHbs.engine({ extname: "hbs", defaultLayout: 'main'}));
app.set('view engine', '.hbs');
app.set('views', './');
app.use('/image', express.static('image'))
var All=require('./Model/model.js');
var methodOverride = require('method-override')
app.use(methodOverride('_method'))
const { default: mongoose } = require('mongoose');
var Storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'image')
    },
    filename: function (req, file, cb) {
        let filename = file.originalname;
        arr = filename.split('.');
        let newFileName = '';
        for (let i = 0; i < arr.length; i++) {
            if (i != arr.length - 1) {
                newFileName += arr[i];
            } else {
                newFileName += ('-' + Date.now() + "1" + '.' + "png");
            }
        }
        cb(null, newFileName)

    }
})
var upload = multer({ storage: Storage })

app.get('/',(req,res)=>{
    All.find({}).sort({ten:1}).then(data=>{
        res.render('danhsach',{all:data.map(data=>data.toObject())})
       
    })
    
})
app.post('/themsanpham',upload.single('anh'),(req,res)=>{
    var image=req.file.filename;
    var ten=req.body.tensp;
    var gia=req.body.gia;
    var size=req.body.size;
    var msp=req.body.msp;
    All.insertMany({
        image:image,
        ten:ten,
        size:size,
        gia:gia,
        msp:msp
    }).then(data=>{
        res.redirect("/");
    })
})
app.get('/:id',async (req,res)=>{
    try {
        const user = await All.findByIdAndDelete(req.params.id, req.body)
        if (!user) {
            res.status(404).send('ko co file')
        } else {
            res.status(200).redirect('/')
        }
    } catch (error) {
        res.status(500).send(error)
    }
})
app.get("/:id/edit", async (req, res) => {
    All.findById(req.params.id).then(data => res.render('edit', { all:data?data.toObject():data}))
});
app.get("/:id/chitiet", async (req, res) => {
    All.findById(req.params.id).then(data => res.render('chitiet', { all:data?data.toObject():data}))
});
app.post('/search', (req, res, next) => {
    All.find({ten: req.body.tensp }).then(data => { res.render('danhsach', { all:data.map(data=>data.toObject())}) })
})
app.put("/:id", upload.single('anhud'), async (req, res) => {
    const a=req.body;
    if(req.file){
        a.image=req.file.filename
    }
    console.log(a)
    All.findByIdAndUpdate({ _id: req.params.id },a).then(() => res.redirect('/'))
});
app.listen(3000,()=>{ console.log(`Sever started on port`);})


