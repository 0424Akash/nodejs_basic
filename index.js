// const hello = 'Hello world';
// console.log(hello);

const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate.js');


////////////////////////////////////
// Files

//blocking synchronous way---
// const textIn = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is the nodejs output: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./starter/txt/output.txt', textOut);
// console.log('completed!');


//non-blocking asynchronous way---
// // console.log('line 0');
// fs.readFile('./starter/txt/start.txt', 'utf-8', (err, data1) => {
//     // console.log('line 1')
//     fs.readFile(`./starter/txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./starter/txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('./starter/txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('writing...');
//             });
//         });
//     });
// });
// console.log('Reading file...');

////////////////////////////////////
// Server

// const server = http.createServer((req,res)=>{
//     const pathName = req.url;
//     if (pathName === '/' || pathName === '/overview') {
//         res.end('This is OVERVIEW');
//     }else if (pathName === '/product'){
//         res.end('This is PRODUCT');
//     }else if (pathName === '/api') {
//         fs.readFile(`${__dirname}/starter/dev-data/data.json`, 'utf-8', (err,data) => {
//             const productName = JSON.parse(data);
//             // console.log(productName);
//             res.writeHead('200', {'content-type': 'application/json'});
//             res.end(data);
//         });
        
//     } else {
//         res.writeHead(404, {
//             'Content-type': 'text/html',
//             'my-own-header': 'hello-world'
//         });
//         res.end('<h1>Page Not Found!</h1>');
//     }
// });

// server.listen('8000','127.0.0.1',() =>{
//     console.log('Listening on request on port 8000')
// });


////////////////////////////////////////////
// using sync.. SERVER

const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`, 'utf-8',);
const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html`, 'utf-8',);
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`, 'utf-8',);

const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8',);
const dataObj = JSON.parse(data);

const server = http.createServer((req,res)=>{

    const {query, pathname} = url.parse(req.url, true);

    // OVERVIEW
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead('200', {'content-type': 'text/html'});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUT_CARDS%}', cardsHtml);

        res.end(output);
    }
    // PRODUCT
    else if (pathname === '/product'){
        res.writeHead('200', {'content-type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    }
    // API
    else if (pathname === '/api') {
        res.writeHead('200', {'content-type': 'application/json'});
        res.end(data);    
    }
    // NOT FOUND
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page Not Found!</h1>');
    }
});

server.listen('8000','127.0.0.1',() =>{
    console.log('Listening on request on port 8000')
});




