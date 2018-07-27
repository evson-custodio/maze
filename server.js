const app = require('./config/express')();
const server = require('http').createServer(app);

server.listen(app.get('port'), () => {
    console.log('Server Running on http://localhost:' + app.get('port'));
});