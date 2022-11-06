import { Server, createServer } from "http";
import { readFile } from "fs";
import { WebSocketServer } from "ws";

const server: Server = createServer((req, res) => {
    let url: string = !req.url ? "" : req.url;
    if(url === '/') url = "/index.html";
    readFile(`../${url}`, (err, data) => {
        if(err) {
            res.end("404: Page not found");
            return;
        }
        let cont: string = "";
        switch(url.slice(url.indexOf('.'))) {
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
        if(cont) res.writeHead(200, {"Content-Type": cont});
        res.write(data);
        res.end();
    })
})
const wss = new WebSocketServer({server: server});
wss.on("connection", ws => {
    ws.on("message", data => {
        console.log(data.toString());
    })
})
server.listen(8000);