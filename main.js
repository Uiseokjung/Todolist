var express = require('express')
var app = express()
var fs = require('fs')
var template = require('./lib/template.js')
// var qs = require('querystring')
var bodyParser = require('body-parser')
var compression = require('compression')
var topicRouter = require('./routes/add.js')
var indexRouter = require('./routes/index')
var helmet = require('helmet')

app.use(helmet())

app.use(express.static('public'))
app.use(compression())
app.get(`*`, function(request, response, next){
  fs.readdir(`./data`, function(error, filelist){
    request.list = filelist;
    next();
  })
})

app.use(bodyParser.urlencoded({ extended: false}));

app.use('/topic', topicRouter)
app.use('/', indexRouter)

app.use(function(request, response, next){
  response.status(404).send('Sorry cant find that!')
})

app.use(function(err, req, res, next){
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(3000, function(){
    console.log('Example app listening on port 3000!')
});