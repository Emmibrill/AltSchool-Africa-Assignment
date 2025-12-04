const { readFile, writeFile } = require('./external_packages/file_system.js');
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

    //handle different routes and methods
    switch (`${req.method}:${req.url}`) {
        case 'GET:/index.html':
            getStudentPage(req, res);
            break;
        case 'GET:/api/items':
            getAllItems(req, res)
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
        const html = await readFile(studentPage)
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end(html);
    }
    catch(err){
        res.writeHead(500, {'Content-Type':'application/json'});
        res.end(JSON.stringify({
            "status": "error",
            "message": "Error reading file:" + err.message
        }))
    }
    
}


//Get/display all items
async function getAllItems(req, res){
    try{
        const items = await readFile(dbPath);
        res.writeHead(200, {'Content-Type' : 'application/json'});
        res.end(items);
    }
    catch(err){
        res.writeHead(500, {'Content-Type' : 'application/json'});
        res.end(JSON.stringify({
            "status" : "error",
            "message": "Error reading file: " + err.message
        }))
    }
    
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
        // console.log(newItem);

        //Read and write the items file
        try{
            const items = await readFile(dbPath)
            const oldItems = JSON.parse(items);

            //Dynamically assign id to new item
            const newItemsId = oldItems.length > 0 ? oldItems[oldItems.length - 1].id + 1 : 0;
            newItem.id = newItemsId;

            //Collect all items together
            const newItemList = [...oldItems, {id: newItemsId,...newItem}];
            // console.log(newItem)

           //Write the new list of items back to the file
           try{
            await writeFile(dbPath, newItemList, res, newItem)
           }
           catch(err){
            res.writeHead(500, {'Content-Type' : 'application/json'});
            res.end(JSON.stringify({
                "status" : "error",
                "message": "Error writing file: " + err.message
            }))
           }
        }
        catch(err){
            res.writeHead(500, {'Content-Type' : 'application/json'});
            res.end(JSON.stringify({
                "status" : "error",
                "message": "Error reading file: " + err.message
            }))
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
            const Items = await readFile(dbPath);
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
                }))
            }

            //update the item
            const updatedItems = {...oldItems[itemIndex], ...updateData};
            oldItems[itemIndex] = updatedItems;
            // console.log(updatedItems)

            //write the updated items back to the file
            try{
                await writeFile(dbPath, oldItems, res, updatedItems)
            }
            catch(err){
                res.writeHead(500, {'Content-Type' : 'application/json'});
                res.end(JSON.stringify({
                    "status" : "error",
                    "message": "Error writing file: " + err.message
                }))
            }
        }
        catch(err){
            res.writeHead(500, {'Content-Type':'application/json'});
            res.end(JSON.stringify({
                "status": "error",
                "message": "Error reading file: " + err.message
            }))
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
        // console.log(cleanedId);

        //get the id of the item to be deleted
        const itemId = cleanedId.id

        //Read the items file
        try{
            const items = await readFile(dbPath);
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
                writeFile(dbPath, parsedItems, res, updatedItems);
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
            }))
        }
    });
}


//listen to server with the port and host created
server.listen(PORT, HOST_NAME, () => {
    console.log(`Server is running at http://${HOST_NAME}:${PORT}/`);
});