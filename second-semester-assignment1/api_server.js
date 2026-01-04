const { openFile, writeToFile } = require('./external_packages/file_system.js');
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


//handle requests
function requestHandler(req, res) {

    const url = new URL(req.url, `http://${req.headers.host}`);
    let route = `${req.method}:${url.pathname}`;
    let id = null;

    if(req.method === 'GET' && url.pathname.startsWith('/api/items/')){
        //extract id from the url
        id = Number(url.pathname.split('/')[3]);

        //Validate id and route
        if(isNaN(id) || url.pathname.split('/').length > 4){
            res.writeHead(400, {'Content-Type':'application/json'});
            res.end(JSON.stringify({
                "status": "error",
                "message": "Invalid id or route"
            }));
            return;
        }
        //set the id in request object and update route
        req.params = {id};
        route = 'GET:/api/items/:id';
    }

    //handle different routes and methods
    switch (route) {
        case 'GET:/api/items':
            getAllItems(req, res);
            break;
        case 'GET:/api/items/:id':
            getItem(req, res);
            break;
        case 'POST:/api/items':
            addItem(req, res);
            break;
        case 'PUT:/api/items':
            updateItems(req, res);
            break;
        case 'DELETE:/api/items':
            deleteItem(req, res);
            break;
        default:
            res.writeHead(404, {'Content-Type':'application/json'});
            res.end(JSON.stringify({
                "status" : "error",
                "message": "page not found"
            }));
            break;
    }
}


//Get/display all items
async function getAllItems(req, res){
    try{
        const items = await openFile(dbPath);
        const parsedItems = JSON.parse(items);
        res.writeHead(200, {'Content-Type' : 'application/json'});
        res.end(JSON.stringify(parsedItems));
        return; 
    }
    catch(err){
        res.writeHead(500, {'Content-Type' : 'application/json'});
        res.end(JSON.stringify({
            "status" : "error",
            "message": "Error reading file: " + err.message
        }));
        return;
    }
}
//Get a single item by id
async function getItem(req, res){
    const id = req.params.id;
    // console.log(id)
    const items = await openFile(dbPath);
    const parsedItems = JSON.parse(items)
    const findItem = parsedItems.findIndex(item => item.id === id);
    if(findItem === -1){
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end(JSON.stringify({
            "status": "error",
            "message": `Item with id:${id} not found`
        }));
        return;
    }
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify(parsedItems[findItem]));
    // console.log(parsedItems[findItem])
    // console.log(findItem);
}

//Add items to the list of items
function addItem(req, res){

    //Collect the items data from the users
    const itemToAdd = [];
    req.on('data', itemDataChunk => {
        itemToAdd.push(itemDataChunk);
    });

    req.on('end', async () => {
        //convert items data from buffer to usable data string
        const item = Buffer.concat(itemToAdd).toString();
        const newItem = JSON.parse(item);

        //Read and write the items file
        try{
            const items = await openFile(dbPath)
            const oldItems = JSON.parse(items);

            //Dynamically assign id to new item
            const newItemsId = oldItems.length > 0 ? oldItems[oldItems.length - 1].id + 1 : 0;
            newItem.id = newItemsId;

            //Collect all items together
            const newItemList = [...oldItems, {id: newItemsId,...newItem}];
            // console.log(newItem)

           //Write the new list of items back to the file
           try{
            await writeToFile(dbPath, newItemList, res, newItem)
           }
           catch(err){
            res.writeHead(500, {'Content-Type' : 'application/json'});
            res.end(JSON.stringify({
                "status" : "error",
                "message": "Error writing file: " + err.message
            }));
            return;
           }
        }
        catch(err){
            res.writeHead(500, {'Content-Type' : 'application/json'});
            res.end(JSON.stringify({
                "status" : "error",
                "message": "Error reading file: " + err.message
            }));
            return;
        }
    });
}

//update items
function updateItems(req, res){
    //Collect items attributes to update
    const itemData = [];
    req.on('data', itemDataChunk => {
        itemData.push(itemDataChunk)
    });

    req.on('end', async () => {
        //Convert buffer form users to usable data string 
        const updateDataString = Buffer.concat(itemData).toString();
        const updateData = JSON.parse(updateDataString);

        //get the id of the item to be updated
        const itemId = updateData.id;

        //Read the items file
       try{
            const Items = await openFile(dbPath);
            //find the item to be updated
            const oldItems = JSON.parse(Items);
            const itemIndex = oldItems.findIndex(item => item.id === itemId);
            
            //if item not found
            if(itemIndex === -1){
                console.error('Item not found');
                res.writeHead(404, {'Content-Type':'application/json'})
                res.end(JSON.stringify({
                    "status": "error",
                    "message": `Item with id:${itemId} not found`
                }));
                return;
            }

            //update the item
            const updatedItems = {...oldItems[itemIndex], ...updateData};
            oldItems[itemIndex] = updatedItems;
            // console.log(updatedItems)

            //write the updated items back to the file
            try{
                await writeToFile(dbPath, oldItems, res, updatedItems);
                return;
            }
            catch(err){
                res.writeHead(500, {'Content-Type' : 'application/json'});
                res.end(JSON.stringify({
                    "status" : "error",
                    "message": "Error writing file: " + err.message
                }));
                return;
            }
        }
        catch(err){
            res.writeHead(500, {'Content-Type':'application/json'});
            res.end(JSON.stringify({
                "status": "error",
                "message": "Error reading file: " + err.message
            }));
            return;
        }

    });
}

function deleteItem(req, res){
    //Collect item attributes to delete
    const itemToDleteId = [];
    req.on('data', itemIdChuck => {
        itemToDleteId.push(itemIdChuck);
    })
    
    //Handle the end of data collection
    req.on('end', async () => {

        //Convert buffer form users to usable data string
        const itemIdString = Buffer.concat(itemToDleteId).toString();
        const cleanedId = JSON.parse(itemIdString);

        //get the id of the item to be deleted
        const itemId = cleanedId.id

        //Read the items file
        try{
            const items = await openFile(dbPath);
            const parsedItems = JSON.parse(items)
            // console.log(parsedItems)

            //find the item to be deleted
            const findIndex = parsedItems.findIndex(item => item.id === itemId);
            console.log(findIndex);

            //if item not found display error message
            if(findIndex === -1){
                res.writeHead(404, {'Content-Type':'application/json'});
                res.end(JSON.stringify({
                    "status": "error",
                    "message": `Item with id:${itemId} not found`
                }));
                return;
            }
            //delete the item once item is found
            const updatedItems = parsedItems.splice(findIndex,1);

            //write the updated items back to the file
            try{
                await writeToFile(dbPath, parsedItems, res, updatedItems);
                return;
            }
            catch(err){
                res.writeHead(500, {'Content-Type' : 'application/json'});
                res.end(JSON.stringify({
                    "status" : "error",
                    "message": "Error writing file: " + err.message
                }))
                return;
            }
        }
        catch(err){
            res.writeHead(500, {'Content-Type':'application/json'});
            res.end(JSON.stringify({
                "status": "error",
                "message": "Error reading file: " + err.message
            }));
            return;
        }
    });
}

//listen to server with the port and host created
server.listen(PORT, HOST_NAME, () => {
    console.log(`Server is running at http://${HOST_NAME}:${PORT}/`);
});