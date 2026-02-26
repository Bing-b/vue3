const http = require('http');

const server = http.createServer((req, res) => {
    // CORS 允许所有来源
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.url === '/events') {
        // SSE 响应头
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        let counter = 0;
        const intervalId = setInterval(() => {
            counter++;
            const data = JSON.stringify({
                id: counter,
                time: new Date().toLocaleTimeString(),
                message: `这是来自 SSE 服务器的消息 #${counter}`,
            });
            console.log(`Sending: ${data}`);
            res.write(`data: ${data}\n\n`);
        }, 2000);

        // 客户端断开连接时清除定时器
        req.on('close', () => {
            console.log('Client disconnected');
            clearInterval(intervalId);
            res.end();
        });
    } else {
        res.writeHead(404);
        res.end();
    }
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`SSE Server running at http://localhost:${PORT}/events`);
});
