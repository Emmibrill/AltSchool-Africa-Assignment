const fs = require('fs');
const http = require('http');
const path = require('path');
const dbPath = path.resolve('inventory.json'); 
console.log(dbPath);

//create port number
const PORT = 3000;

//create hostname
const HOST_NAME = 'localhost';

//create server
const server = http.createServer(requestHandler);
const errorPagePath = path.resolve('404.html');


//handle requests
function requestHandler(req, res) {

    //handle different routes and methods
    switch (`${req.method}:${req.url}`) {
        case 'GET:/index.html':
            getStudentPage(req, res);
            break;
        case 'GET:/items':
            getAllItems(req, res)
            break;
        case 'POST:/items':
            addItems(req, res);
            break;
        case 'PUT:/items':
            updateItems(req, res);
            break;
        case 'DELETE:/items':
            deleteItems(req, res);
            break;
        default:
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



function getStudentPage(req, res){
    const studentPage = path.resolve('index.html');
    // console.log(studentPage);
    fs.readFile(studentPage, 'utf8', (err, page) => {
        if(err){
            console.error('Error reading student page');
            res.writeHead(500, {'Content-Type' : 'application/json'});
            res.end(JSON.stringify({
                "status" : "error",
                "message": "There was an error reading the student page"
            }));
            return;
        }
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(page);

    });
}

//Get/display all items
function getAllItems(req, res){
    fs.readFile(dbPath, 'utf8', (err, items) => {
        if(err){
            console.error('Error reading items file ');
            res.writeHead(500, {'Content-Type' : 'application/json'});
            res.end(JSON.stringify({
                "status" : "error",
                "message": err
            }))
        }
        res.writeHead(200, {'Content-Type' : 'application/json'});
        res.end(items);
    });
}

//Add items to the list of items
function addItems(req, res){

    //Collect the items data from the users
    const itemsToAdd = [];
    req.on('data', itemsDataChuch => {
        itemsToAdd.push(itemsDataChuch);
    });

    //convert items data from buffer to usable data string
    req.on('end', () => {
        const items = Buffer.concat(itemsToAdd).toString();
        const newItems = JSON.parse(items);
        console.log(newItems);

        fs.readFile(dbPath, 'utf8', (err, items) => {
            if(err){
                console.error('Error reading items file');
                res.writeHead(500, {'Content-Type':'application/json'});
                res.end(JSON.stringify({
                    "status": "error",
                    "message": err
                }));
                return;
            }
            const oldItems = JSON.parse(items);
            //Dynamically assign id to new item
            const newItemsId = oldItems.length > 0 ? oldItems[oldItems.length - 1].id + 1 : 0;
            newItems.id = newItemsId;

            //Collect all items together
            const newItemsList = [...oldItems, {id: newItemsId,...newItems}];
            // console.log(newItem)
            const cleanedItems = JSON.stringify(newItemsList);
            fs.writeFile(dbPath, cleanedItems, (err) => {
                if(err){
                    console.error('Error writing items file');
                    res.writeHead(500, {'Content-Type':'application/json'})
                    res.end(JSON.stringify({
                        "status": "error",
                        "message": err
                    }));
                    return;
                }
                res.writeHead(200, {'Content-Type':'application/json'});
                res.end(JSON.stringify(newItems));
            });
        });
    });


}


//update items
function updateItems(req, res){
    //Collect items attributes to update
    const itemData = [];
    req.on('data', itemDataChunk => {
        itemData.push(itemDataChunk)
    })
    
    req.on('end', () => {
        const updateDataString = Buffer.concat(itemData);
        const updateData = JSON.parse(updateDataString);
        const itemId = updateData.id

        fs.readFile(dbPath, 'utf8', (err, Items) => {
            if(err){
                console.error('Error reading items file');
                res.writeHead(500, {'Content-Type':'application/json'});
                res.end(JSON.stringify({
                    "status": "error",
                    "message": err
                }))
            }
            const oldItems = JSON.parse(Items)
            const itemIndex = oldItems.findIndex(item => item.id === itemId)
            
            if(itemIndex === -1){
                console.error('Item not found');
                res.writeHead(404, {'Content-Type':'application/json'})
                res.end(JSON.stringify({
                    "status": "error",
                    "message": `Item with id:${itemId} not found`
                }))
            }

            const updatedItems = {...oldItems[itemIndex], ...updateData}
            oldItems[itemIndex] = updatedItems
            // console.log(updatedItems)
            const cleanedItems = JSON.stringify(oldItems)
            fs.writeFile(dbPath, cleanedItems, (err) => {
                if(err){
                    res.writeHead(500, {'Content-Type':'application/json'});
                    res.end(JSON.stringify({
                        "status": "error",
                        "message": err
                    }));
                    return;
                }
                res.writeHead(200, {'Content-Type':'application/json'});
                res.end(JSON.stringify(updatedItems));
            })
        })

    })
}



//listen to server with the port and host created
server.listen(PORT, HOST_NAME, () => {
    console.log(`Server is running at http://${HOST_NAME}:${PORT}/`);
});