var express = require('express')
var router = express.Router()
var path = require('path')
var fs = require('fs')
var sanitizeHtml = require('sanitize-html')
var template = require('../lib/template.js')


router.get('/create', function(request, response){
    var title = 'TodoList - create';
     var list = template.list(request.list);
     var html = template.HTML(title, list, `
       <form action="/todo/create_process" method="post">
         <p><input type="text" name="title" placeholder="Todo"></p>
         <p>
           <textarea name="description" placeholder="description of Your Todo"></textarea>
         </p>
         <p>
           <input type="submit">
         </p>
       </form>
     `, '');
     response.send(html);
  });
  
router.post('/create_process', function(request, response){
    var post = request.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
      response.redirect(`/todo/${title}`);
             })
  });
  
router.get('/modify/:pageId', function(request, response){
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      var title = request.params.pageId;
      var list = template.list(request.list);
      var html = template.HTML(title, list,
        `
        <form action="/todo/modify_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
        `<a href="/todo/create">create</a> <a href="/todo/modify?id=${title}">modify</a>`
      );
      response.send(html);
    });
  });
  
router.post('/modify_process', function(request, response){
      var post = request.body;
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function(error){
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.redirect(`/todo/${title}`);
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
                    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
                    if(err){ 
                        next(err)
                    } else{
                      var title = request.params.pageId;
                       var sanitizedTitle = sanitizeHtml(title);
                       var sanitizedDescription = sanitizeHtml(description, {
                         allowedTags:['h1']
                       });
                       var list = template.list(request.list);
                       var html = template.HTML(sanitizedTitle, list,
                         `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                         ` <a href="/todo/create">create</a>
                           <a href="/todo/modify/${sanitizedTitle}">modify</a>
                           <form action="/todo/delete_process" method="post">
                             <input type="hidden" name="id" value="${sanitizedTitle}">
                             <input type="submit" value="delete">
                           </form>`
                       );
                       response.send(html);
                  }
        });
  });

  module.exports=router