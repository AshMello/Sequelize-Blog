const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
var session = require('express-session')
const app = express()
const path = require('path')
const models = require('./models')

app.use(bodyParser.urlencoded({ extended: false }))
app.engine('mustache',mustacheExpress())
app.set('views','./views')
app.set('view engine','mustache')

// const VIEWS_PATH = path.join(__dirname, '/views')
// app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))

app.get('/index',(req,res)=> {
    models.Post.findAll().then(function(post){
        res.render('index', {posts: post})
    })
})

app.get('/deletepost',(req,res)=> {
    res.render('deletepost')
})

app.post('/index',(req,res) => {
    let posts = models.Post.build({
        title: req.body.title,
        body: req.body.textbody,
        category: req.body.category
    })
    posts.save().then(function(newPost){
        console.log(newPost)
    })
    res.redirect('index')
})

app.post('/deletepost',(req,res)=>{
    models.Post.destroy({
        where: {
          id : req.body.postId
        }
      })
      res.redirect('index')
})

app.post('/updatechoice',(req,res)=>{
    models.Post.update({
        title: req.body.postTitle,
        body: req.body.postBody,
        category: req.body.postCategory
      },{
        where: {
          id: req.body.postId
        }
      })
      res.redirect('index')
})

app.post('/editpost',(req,res)=> {
    models.Post.findOne({
        where: {
          id : req.body.postId
        }
      }).then((post) => {
        res.render('updatechoice', {posts: post})
      })
})

app.post('/filtered',(req,res)=> {
    models.Post.findAll({
        where: {
          category: req.body.categoryChoice
        }
      }).then((post) => {
        res.render('filtered', {posts: post})
      })
})

app.get('/editpost',(req,res)=> {
    res.render('editpost')
})

app.get('/filtered',(req,res)=> {
    res.render('filtered')
})


app.listen(3000,() => {
    console.log("Server is running...")
  })