
const mDate = require('./module/MyDate.js');
const fs = require('fs');

const msg = "\nHello World\n";


try {

    //reading a file synchronously
    const readData = fs.readFileSync('./app/afiles/readMe.txt', 'utf8');
    console.log(readData); // 1

    //reading a file asynchronously
    // fs.readFile('./app/files/readMe.txt', 'utf-8', (err, data) => {
    //     if (err) {            
    //         // console.log(err);
    //         fs.appendFile('./app/log.txt', `Error: ${err}, Date: ${new Date()}\n`, (err) => {
    //             console.log(err);
    //         });
    //     } else {
    //         console.log(data); // 3
    //     }
    // });

    //writing a file synchronously
    // fs.writeFileSync('./app/files/test.txt', msg); //1

    // writing a file asynchronously
    // fs.writeFile('./app/files/test2.txt', msg, () => {
    //     console.log('File Written Successfully!');
    // });

    // appending a file synchronously
    // fs.appendFileSync('./app/files/test2.txt', '\n It\'s pleasant up here!');

    // appending a file asynchronously
    // fs.appendFile('./app/files/test2.txt', msg, () => {
    //     console.log('File Appended Successfully!');
    // });

    console.log(msg); // 2
    console.log('Date is: ', mDate()); // 3

    // Event - Queue-- > req1(readFile), req2("Hello World"), req3(print Date)
    // Event - Loop-- > req1 is pending to be completed, req2("Hello World") executed Immediately, req3(print Date) executed Immediately
    // Req1 Set aside and a thread is Assigned for its execution.Once completed this will be send as a callback to event-loop.


} catch (e) {
    fs.appendFile('./app/log.txt', `Error: ${e}, Date: ${new Date()}\n`, (err) => {
        // console.log(err);
    });
}