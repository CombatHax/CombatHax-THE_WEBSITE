"use strict";
exports.__esModule = true;
var http_1 = require("http");
var fs_1 = require("fs");
var ws_1 = require("ws");
var server = (0, http_1.createServer)(function (req, res) {
    var url = !req.url ? "" : req.url;
    if (url === '/')
        url = "/index.html";
    (0, fs_1.readFile)("../".concat(url), function (err, data) {
        if (err) {
            res.end("404: Page not found");
            return;
        }
        var cont = "";
        switch (url.slice(url.indexOf('.'))) {
            case '.html':
                cont = "text/html";
                break;
            case '.js':
                cont = "text/javascript";
                break;
            case '.css':
                cont = "text/css";
                break;
            case '.png':
                cont = "image/png";
                break;
        }
        if (cont)
            res.writeHead(200, { "Content-Type": cont });
        res.write(data);
        res.end();
    });
});
var wss = new ws_1.WebSocketServer({ server: server });
var servers = 0;
wss.on("connection", function (ws) {
    ws.on("message", function (data) {
        console.log(data.toString());
        var request = JSON.parse(data.toString());
        switch (request.type) {
            case "SERVER_REQUEST":
                var response_1 = {
                    type: "SERVER_FOUND"
                };
                servers++;
                var prom = new Promise(function (resolve) {
                    if (!(servers % 2)) {
                        resolve("");
                    }
                });
                prom.then(function () {
                    ws.send(JSON.stringify(response_1));
                    console.log(servers);
                });
                break;
        }
    });
});
server.listen(8000);
