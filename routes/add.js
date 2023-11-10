var express = require('express')
var router = express.Router()
var path = require('path')
var fs = require('fs')
var sanitizeHtml = require('sanitize-html')
var template = require('../lib/template.js')


router.get('/add', function(request, response){
    var title = 'Todo - add';
     var list = template.list(request.list);
     var html = template.HTML(title, list, `
       <form action="/todo/add_process" method="post">
         <p><input type="text" name="title" placeholder="title"></p>
         <p>
           <textarea name="description" placeholder="description"></textarea>
         </p>
         <p>
           <input type="submit">
         </p>
       </form>
     `, '');
     response.send(html);
  });
  
router.post('/add_process', function(request, response){
    var post = request.body;
    var Todo = post.title;
    var TodoDesc = post.description;
    fs.writeFile(`data/${Todo}`, TodoDesc, 'utf8', function(err){
      response.redirect(`/Todo/${Todo}`);
             })
  });
  
router.get('/modify/:pageId', function(request, response){
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, TodoDesc){
      var Todo = request.params.pageId;
      var list = template.list(request.list);
      var html = template.HTML(title, list,
        `
        <form action="/topic/update_process" method="post">
          <input type="hidden" name="id" value="${Todo}">
          <p><input type="text" name="title" placeholder="title" value="${Todo}"></p>
          <p>
            <textarea name="description" placeholder="description">${TodoDesc}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
        `<a href="/todo/add">add</a> <a href="/todo/modify?id=${Todo}">modify</a>`
      );
      response.send(html);
    });
  });
  
router.post('/modify_process', function(request, response){
      var post = request.body;
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${Todo}`, function(error){
        fs.writeFile(`data/${Todo}`, TodoDesc, 'utf8', function(err){
          response.redirect(`/todo/${Todo}`);
        });
      });
  });
  
router.post('/delete_process', function(request, response){
    var post = request.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function(error){
      response.redirect(`/`);
    });
  });
  
router.get('/:pageId', function(request,response,next){
                    var filteredId = path.parse(request.params.pageId).base;
                    fs.readFile(`data/${filteredId}`, 'utf8', function(err, TodoDesc){
                    if(err){ 
                        next(err)
                    } else{
                      var Todo = request.params.pageId;
                       var sanitizedTodo = sanitizeHtml(Todo);
                       var sanitizedDescription = sanitizeHtml(TodoDesc, {
                         allowedTags:['h1']
                       });
                       var list = template.list(request.list);
                       var html = template.HTML(sanitizedTodo, list,
                         `<h2>${sanitizedTodo}</h2>${sanitizedDescription}`,
                         ` <a href="/todo/add">add</a>
                           <a href="/todo/modify/${sanitizedTodo}">modify</a>
                           <form action="/todo/delete_process" method="post">
                             <input type="hidden" name="id" value="${sanitizedTodo}">
                             <input type="submit" value="delete">
                           </form>`
                       );
                       response.send(html);
                  }
        });
  });

  module.exports=router