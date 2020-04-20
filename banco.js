const sqlite3 = require('sqlite3')

let db = new sqlite3.Database('agregados.db', (err) => {
    if (err) {
    return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

module.exports.inserirDB = function(data){
    var d = data
    console.log(data) 

    db.serialize(function(){ 
        //cria as tabelas      
        db.run('CREATE TABLE IF NOT EXISTS "saida" ("idSaida" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "dataSaida" TEXT, "nomeAgregado" TEXT)')
        db.run('CREATE TABLE IF NOT EXISTS "item" ("idItem" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "numNota" INTEGER, "valorPedido" REAL, "valorFrete" INTEGER, "status" TEXT, "idFSaida" INTEGER, FOREIGN KEY(`idFSaida`) REFERENCES `saida`(`idSaida`))')        
        
        //inserir os dados
        db.run('INSERT INTO "saida" ("dataSaida", "nomeAgregado") VALUES (?, ?)', [d.nData, d.sAgregado])
        
        db.all('select idSaida from saida order by idSaida desc limit 1',[], function(err, rows){
            var u = rows[0].idSaida
            for(i = 0; i < d.item.length; i++){
                db.run('INSERT INTO "item" ("numNota", valorPedido, valorFrete, idFSaida) VALUES (?,?,?,?)', [d.item[i].nPedido, d.item[i].nValor, d.item[i].nFrete, u])
            }
                        
        })
        //fecha o banco   
    })
}




