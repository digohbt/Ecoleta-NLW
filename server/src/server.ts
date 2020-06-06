import express from 'express';
import routes from "./routes"
import path from 'path'
import cors from 'cors'

const app = express();
app.use(cors())
app.use(express.json());
app.use(routes)
app.use('/uploads', express.static(path.resolve(__dirname, "..", 'uploads')));

app.listen(3333);
// rota: e endereço completo da requisição 
// recursos : qual entidade estamos acessand no sistema
// get : buscar uma ou mais informaçoes 
//post : Criar um ma nova informaçao no back end 
//put: atualizar ua informaçao exixtente no back end 
// request params : parametros que vem na propria rota que indentifica usuario

// Query parans parametros que ven na rota geralmente opcipnais 
// requeste body : parametros que vem na totas 





