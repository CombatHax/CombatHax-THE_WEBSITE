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
let servers: number = 0;
wss.on("connection", ws => {
    ws.on("message", data => {
        console.log(data.toString());
        const request = JSON.parse(data.toString());
        switch(request.type) {
            case "SERVER_REQUEST":
                const response = {
                    type: "SERVER_FOUND"
                }
                servers++;
                const prom = new Promise((resolve) => {
                    if(!(servers % 2)) {
                        resolve("");
                    }
                })
                prom.then(() => {
                    ws.send(JSON.stringify(response))
                    console.log(servers);
                })
                break;
        }
    })
})
server.listen(8000);