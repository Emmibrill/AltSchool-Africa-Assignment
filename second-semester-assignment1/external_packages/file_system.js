const fs = require('fs');

//Read file
function openFile(filePath){
    return new Promise ((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if(err){
                return reject(err);
            }else{
                resolve(data);
            }
        });
    })
}

//Write file
function writeToFile(filePath, rawData, res, output){
    return new Promise ((resolve, reject) => {
        const cleanedData = JSON.stringify(rawData)
        fs.writeFile(filePath, cleanedData, (err) => {
            if(err){
                return reject(err);
            }else{
                resolve(json)
            }
        });
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(output));
    });
}

//Export functions
module.exports = {
    openFile,
    writeToFile
}