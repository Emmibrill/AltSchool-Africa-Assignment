const { openFile } = require('./external_packages/file_system.js');
const fs = require('fs');
const http = require('http');
const path = require('path');


const PORT = 4000;

//create hostname
const HOST_NAME = 'localhost';

//create server
const server = http.createServer(requestHandler);



//handle requests
function requestHandler(req, res) {

    //handle different routes and methods
    switch (`${req.method}:${req.url}`) {
        case 'GET:/index.html':
            getStudentPage(req, res);
            break;
        default:
            const errorPagePath = path.resolve('404.html');
            fs.readFile(errorPagePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading 404 page', err);
                    res.writeHead(500, {'Content-Type' : 'application/json'});
                    res.end(JSON.stringify({
                        "status" : "error",
                        "message": "There was an error reading the 404 page"
                    }));
                    return;
                }
                res.writeHead ( 404, {'Content-Type' : 'text/html' })
                res.end(data);
            });
            break;
    }
}

//Get student page
async function getStudentPage(req, res){

    try{
        const studentPage = path.resolve('index.html');
        const html = await openFile(studentPage)
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(html);
        return;
    }
    catch(err){
        res.writeHead(500, {'Content-Type':'application/json'});
        res.end(JSON.stringify({
            "status": "error",
            "message": "Error reading file:" + err.message
        }));
        return;
    }  
}

//listen to server with the port and host created
server.listen(PORT, HOST_NAME, () => {
    console.log(`Server is running at http://${HOST_NAME}:${PORT}/`);
});