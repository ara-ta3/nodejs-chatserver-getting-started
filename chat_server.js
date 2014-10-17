var ws = require('websocket.io');
var server = ws.listen(8888, function () {
    console.log('\033[96m Server running at 172.16.145.136:8888 \033[39m');
});

var mysql = require('mysql');
var connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : ""
});
connection.connect();

connection.query('USE test');

//コネクションクローズ
server.on('connection', function(socket) {
    socket.on('message', function(data) {

        var data = JSON.parse(data);
        var d = new Date();
        data.time = d.getFullYear()  + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        var userName = data.user;
        connection.query(
            'INSERT INTO nodetest SET name = ?;', userName, function(err) {console.log(err);data.err=err;}
        );
        data = JSON.stringify(data);
        server.clients.forEach(function(client) {
            client.send(data);
        });
    });
});
//connection.end();
