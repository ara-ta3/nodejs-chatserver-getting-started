var ws = require('websocket.io'),
    host = "localhost",
    port = 8888;
var server = ws.listen(port, function () {
    console.log('\033[96m Server running at '+ host + ":" + port +' \033[39m');
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
            'INSERT INTO nodetest SET name = ?;', [userName], function(err) {
                data.err = null;
                if( !err ) {
                    console.log(err);
                    data.err = err;
                }
            }
        );
        data = JSON.stringify(data);
        server.clients.forEach(function(client) {
            client.send(data);
        });
    });
});

server.on('close', function (code,desc) {
    console.log("end");
});
