const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');
const { isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepo(request, response, next){  
   const {title, url, techs} = request.body;
 
   if(!title){
      return response.status(400).json({message: 'Title is required'})
   }
   if(!url){
      return response.status(400).json({message: 'Url is required'})
   }
   if(!techs){
    return response.status(400).json({message: 'Techs is required'})
  }

  return next();

}

function validateId(request, response, next){
  const {id} = request.params;

  if(!isUuid(id)){
    return response.status(400).json({message: 'Invalid ID'})
  };

  return next();
}

app.get("/repositories", (request, response) => {  
  return response.json(repositories);
});

app.post("/repositories", validateRepo, (request, response) => {
  const {title, url, techs} = request.body;
  
  const repository = {id: uuid(), title, url, techs, likes: 0};

  repositories.push(repository)

  return response.json(repository);
});

app.put("/repositories/:id", validateRepo, validateId, (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({message: "Repository not found"})
  }

  const repository = {
    id,
    title,
    url,
    techs
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", validateId, (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({message: "Repository not found"})
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateId, (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({message: "Repository not found"})
  }

  const repository = repositories[repositoryIndex];

  repository.likes = repository.likes + 1;
  
  return response.status(204).send();
  
});

module.exports = app;
