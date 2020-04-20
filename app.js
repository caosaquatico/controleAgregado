const express = require('express')
const bodyParser = require('body-parser')
const urlencodeParser = bodyParser.urlencoded({extended: false})
const sqlite3 = require('sqlite3')
const handlebars = require('express-handlebars')
const port = process.env.PORT || 3000
const app = express()
const banco = require('./banco')
//banco
let db = new sqlite3.Database('agregados.db')

//templete engine
app.engine('handlebars', handlebars({defaultLayout:'main'}))
app.set('view engine', 'handlebars')

//bodyparse
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })); 
var jsonParser = bodyParser.json()

// rotas
//rota index.html
app.get('/', function(req, res){
    res.render('index')
})

//rota saida do agregado
app.get('/saida', function(req,res){
    res.render('saida')
})


//registrar os pedidos
app.post('/enviosaidanotas', jsonParser, function(req, res, err){  
    var d = req.body
    banco.inserirDB(d)    
    console.log("Salvo notas com sucesso")
    res.render('print', {linha: req.body})
})

app.post('/statusNotas', urlencodeParser, function(req){
    let data = [req.body.status, req.body.idNota]    
    let sql = 'UPDATE item SET status = ? WHERE idItem = ?'
    console.log(data)

    db.run(sql, data, function(err) {
        if (err) {
            return console.error(err.message);
        }
    })  
    console.log('status')  
})

//rota para entrada dos pedidos
app.get('/entrada/:agregado?', function(req, res){
    if(!req.params.agregado){
        db.all('select * from saida left join item on idFsaida = idSaida', [], function(err, rows){
            res.render('entrada', {linha: rows})
        })  
    }else{
        db.all('select * from saida left join item on idFsaida = idSaida where nomeAgregado=?', [req.params.agregado], function(err, rows){
            res.render('entrada', {linha: rows})            
        })  
    }
})

app.post('/print', urlencodeParser, function(req, res, err){
    let data = req.body.data
    let agregado = req.body.agregado
    let sql = 'select * from saida left join item on idFSaida = idSaida where nomeAgregado =? and dataSaida = ?'
    
    db.all(sql, [agregado, data], function(err, rows){
        res.render('print', {linha:rows, data:data, agregado:agregado})
    })    
    
})


//select numNota, valorPedido,valorFrete, status from notas where nomeAgregado =? and dataSaida = ?

app.post('/pesquisa', urlencodeParser, function(req, res, err){
    let data = req.body.data
    let agregado = req.body.agregado
    let sql = 'select * from saida left join item on idFSaida = idSaida where nomeAgregado =? and dataSaida = ?'
    
    db.all(sql, [agregado, data], function(err, rows){
        res.render('print', {linha:rows, data:data, agregado:agregado})
    })   
})





//inicializa o servidor
app.listen(port, () =>{
    console.log('Servidor escutando na porta %d', port)
    console.log('Para encerrar o servidor pressione ctrl + c');
})