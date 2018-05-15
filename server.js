const app = require('./config/express')();
const server = require('http').createServer(app);

server.listen(app.get('port'), app.get('ip'), () => {
    console.log('Server Running on http://' + app.get('ip') + ':' + app.get('port'));
});