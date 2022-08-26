
const fs = require('fs');

const events = require('events');

const { Readable } = require('stream');

const myEventEmitter = new events.EventEmitter();

function helloWorld() {
    return 'a';
}

// console.log(helloWorld());

const cache = {};
function readFile(filename, callback) {
    if (cache[filename]) {
        return callback(null, cache[filename]);
    }
    fs.readFile(filename, (err, readData) => {
        if (err) {
            return callback(err);
        };
        cache[filename] = readData;
        callback(null, readData);
    });
}

function letsReadFile() {
    readFile('./sample.txt', (err, data) => {
        console.log('File is read!');
    });
    console.log('File Read Initiated!');
}

// letsReadFile();
// setTimeout(() => {
//     letsReadFile();
// }, 2000);

//event trigger --> event loop() will call the event handler

const first = (...args) => {
    console.log('First Event!', args.join(', '));
}

myEventEmitter.on('omgEvent', first);

myEventEmitter.on('omgEvent', (arg1, arg2) => {
    console.log('Second Event!', arg1, arg2);
});

// console.log(myEventEmitter.listeners('omgEvent'));

// myEventEmitter.emit('omgEvent', 'Apples', 10, { hello: 'world' });

readStream = new Readable({
    read() { }
});

readStream.push('My name is Sid!. ');
readStream.push('Hello Sid! how are you?');
readStream.push(null);

readStream.pipe(process.stdout);