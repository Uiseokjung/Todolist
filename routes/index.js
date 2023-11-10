var express = require('express')
var router = express.Router()
var template = require('../lib/template.js')

router.get('/', function(request,response){
    var title = 'Your TodoList';
    var description = 'Manage your TodoList with me!';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
        `
        <h2>${title}</h2>${description}
        <img src="/images/Todolist.jpg" style="width:300px; display:block; margin-top:10px;">
        `,
        `<a href="/todo/create">create</a>`
    );
    response.send(html);
    });

    module.exports = router