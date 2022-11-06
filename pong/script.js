const ws = new WebSocket(`ws://${url}:${port}`)
const cnv = document.querySelector("canvas");
// 800/600 = 4:3
window.addEventListener("resize", () => {
    let size = [window.innerWidth, window.innerHeight];
    let small = size.indexOf(Math.min(size[0], size[1]));
    cnv.style.width = `${size[small] - 100}px`;
    cnv.style.height = `${(size[small] - 100)}px`;
})
const ctx = cnv.getContext('2d');
window.dispatchEvent(new Event("resize"));
let server = -1;
let ind = 0;
ctx.font = "20px sans-serif";
ctx.textBaseline = "top";
const start = (int) => {
    ctx.clearRect(0, 0, cnv.clientWidth, cnv.clientHeight);
    ctx.fillStyle = "#0";
    ctx.fillRect(0, 0, cnv.clientWidth, cnv.clientHeight);
    ctx.fillStyle = "#f00";
    const str = "LOOKING FOR SERVER" + ".".repeat(ind % 3);
    const pos = ctx.measureText(str).width / 4;
    ctx.fillText(str, pos, 0);
    ind++;
}
const play = () => {
    console.log("Play");
    ctx.fillStyle = "#0";
    ctx.fillRect(0, 0, cnv.clientWidth, cnv.clientHeight);
    window.requestAnimationFrame(play);
}
ws.addEventListener("open", () => {
    ws.send(JSON.stringify({
        type: "SERVER_REQUEST"
    }));
    let int = setInterval(start, 250, this);
})
ws.addEventListener("message", ev => {
    console.log(ev.data);
})
let players = [0, 0]