const express = require('express')
const mongoose = require('mongoose')
let multer = require('multer')
let upload = multer()
const app = express()
app.use(upload.none())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', "ejs")
app.set('views', './views')

const { userDb } = require('./userSchema')
const {taskDb} = require('./todoSchema')

app.get('/', (req, res) => {
    res.render('login')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.get('/get', async (req, res) => {
    try{
        let registerUser = null
        registerUser = await userDb.find({})
        if (registerUser != null) {
            let userRes = []
            registerUser.forEach((usr, id, arr) => {
                userRes.push(usr.email)
                if (id == arr.length - 1) {
                    res.json({ userArr: userRes })
                }
            })
        } else {
            res.json({ msg: "No user present" })
        }
    }catch(err){
        res.send(err)
    }
})



app.post('/register', async (req, res) => {
    try{
        let registerUser = null
        registerUser = await userDb.findOne({ email: req.body.email })
        console.log(registerUser)
        if (registerUser == null) {
            let data = await userDb.create({
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
                confirm_password: req.body.confirm_password
            })
            res.render('home', {_id:data._id})
        } else {
            res.render('home', {_id: registerUser._id})
        }
    }catch(err){
        res.send(err)
    }
})

app.post('/login', async (req, res) => {
    try{
        let registerUser = false
        console.log(req.body.email, req.body.password)
        registerUser = await userDb.findOne({ email: req.body.email })
        console.log(registerUser.email)
        if (registerUser && registerUser.password == req.body.password && registerUser.confirm_password == req.body.password) {
            // res.json({msg:"user logged in"})
            let data = await taskDb.find({createdBy: registerUser._id})
            res.render('home',{task: data})
        } else {
            res.render('signup')
        }
    }catch(err){
        res.send(err)
    }
})

app.patch('/user', async (req, res) => {
    try{
        let registerUser = null
        let updateData = JSON.parse(req.body.updateData)
        registerUser = await userDb.findOneAndUpdate({ email: req.body.email }, updateData, { new: true })
        if (registerUser && registerUser.email == req.body.email) {
            res.json({ msg: "user data updated successfully" })
        } else {
            res.json({ msg: "User is not preset please register" })
        }
    }catch(err){
        res.send(err)
    }
})

app.post('/add', async (req, res) => {
    let fetchData = null
    if(req.body.task != ""){
        fetchData = await taskDb.create({
            createdBy:req.body._id,
            task: req.body.task,
            description: req.body.description
        })
        if(fetchData != null){
            res.render('home', {task: fetchData})
        }
    }else{
        res.json({msg: "please enter something"})
    }
})

app.post('/operations', async (req, res) => {
    let id = null
    Object.keys(req.body).forEach(key => key != ("action" || "items")  && (!key.includes("description_")) ? id = key : null)
    console.log(req.body)
    switch(req.body.action){
        case "add":
            id == null ? Object.keys(req.body).forEach(key => key.includes("description_") ? id = key.split('_')[1] : null) : null
            res.render('home', {_id: id})
            break
        case "update":
            break
        case "delete":
            console.log(Object.keys(req.body), 'iiiiiiiiiiii ',id)
           id == null ? Object.keys(req.body).forEach(key => key.includes("description_") ? (id = key.split('_')[1], console.log("#######", id) ) : null) : null
        console.log(`id ${req.body[id]}`)        
        let found_record =  await taskDb.findOne({task: req.body[id]})
        console.log(' recored ', found_record)
        let deleted_record = await taskDb.findOneAndDelete({_id: found_record._id})
        console.log(id,'deleted recored ', deleted_record)
        let data = await taskDb.find({createdBy: id})
                console.log('data ' + data)
                res.render('home', {task:data})
            break
    }
})

app.listen(3004, () => {
    mongoose.connect('mongodb://127.0.0.1:27017/todo-assignment')
    console.log('express server created and local mongo connection established')
})