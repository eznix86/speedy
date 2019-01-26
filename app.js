const fs = require('fs')
const request = require('request');
const Ora = require('ora');
var url = ''; //LINK TO FILE TO BE DOWNLOADED

let size = 0;
let cur = 0;
let speed = "";

const downloadInfo = new Ora('Fetching data').start();

var req = request(url);

req.on('error', function(err){
    downloadInfo.fail('Unable to download this file');
})


req.on('data', function (chunk) {
    // console.log(chunk.length);
    var bitsLoaded = chunk.length * 8;
    var speedBps = bitsLoaded;
    var speedKbps = (speedBps / 1024).toFixed(2);
    var speedMbps = (speedKbps / 1024).toFixed(2);

    if(speedBps > 1024){
        // console.log(speedKbps, 'KB/s' )
        speed = [speedKbps, 'KB/s'].join(' ')
    }else if(speedKbps > 1024){
        // console.log(speedMbps, 'MB/s'  )
        speed = [speedMbps, 'MB/s'].join(' ')
    }else {
        // console.log(speedBps, 'B/s' )
        speed = [speedBps, 'B/s'].join(' ')
    }

    cur += chunk.length;
    // console.log("Downloading " + (100.0 * cur / size).toFixed(2) + "% " + (cur / 1048576).toFixed(2) + " mb");
    downloadInfo.text = "Downloading " + (100.0 * cur / size).toFixed(2) + "% | " + (cur / 1048576).toFixed(2) + " mb | " + speed;
  
});

req.on('end', function() {
    downloadInfo.succeed('Downloaded | ' + speed);
});

req.on( 'response', function ( data ) {
    size = parseInt(data.headers['content-length'], 10); 
    console.log(size / 8);
    console.log(size);
    var name =  getFileName(data.headers['content-disposition'])
    var out = fs.createWriteStream(name);
    req.pipe(out);
} );

let getFileName = function(content){
    var end = content.length;
    var start = content.indexOf('filename=') + 9;
    return content.substring(start, end);
}


