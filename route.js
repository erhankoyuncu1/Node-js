const fs = require('fs');
const { Server } = require('http');

const routeHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    res.setHeader('Content-Type', 'text/html');

    if (url === '/') {
        res.write(`
                <html>
                    <head>
                        <title>Enter Message</title>
                    </head>
                    <body>
                        <form method="POST" action="/log">
                            <input type="text" name="message">
                            <button type="submit">Send</button>
                        </form>
                    </body>
                </html>
            `);
        return res.end();
    }

    if (url === '/log' && method === 'POST') {

        const body = [];

        req.on('data', (chunk) => {
            body.push(chunk);
        });

        req.on('end', () => {
            const bodyParsed = Buffer.concat(body).toString();
            const message = bodyParsed.split('=')[1];

            fs.appendFileSync("deneme", message + '\n');
        })
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
    }
}

module.exports = routeHandler;
