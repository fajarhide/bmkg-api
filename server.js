// 2018 bmkg api - fajarhide
var express = require('express');
var http = require('http');
var path = require('path');
var parser = require('xml2json');
var app = express();

// function get content url
const getContent = function(url) {
    return new Promise((resolve, reject) => {
        const lib = url.startsWith('https') ? require('https') : require('http');
        const request = lib.get(url, (response) => {
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed to load page, status code: ' + response.statusCode));
            }
            const body = [];
            response.on('data', (chunk) => body.push(chunk));
            response.on('end', () => resolve(body.join('')));
        });
        request.on('error', (err) => reject(err))
    });
};

// index
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// Endpoint Gempa Terkini
app.get('/gempaterkini', function(req, res) {
    getContent('http://data.bmkg.go.id/gempaterkini.xml')
    .then(function (data) {
        var jsonData = parser.toJson(data);
        res.type('application/json');
        res.send(jsonData);
    })
    .catch(function (err) {
        console.error(err);
    });
});

// Endpoint Gempa Dirasakan
app.get('/gempadirasakan', function(req, res) {
    getContent('http://data.bmkg.go.id/gempadirasakan.xml')
    .then(function (data) {
        var jsonData = parser.toJson(data);
        res.type('application/json');
        res.send(jsonData);
    })
    .catch(function (err) {
        console.error(err);
    });
});

// Endpoint Gempa Terupdate
app.get('/gempadirasakanupdate', function(req, res) {
    getContent('http://data.bmkg.go.id/lastgempadirasakan.xml')
    .then(function (data) {
        var jsonData = parser.toJson(data);
        res.type('application/json');
        res.send(jsonData);
    })
    .catch(function (err) {
        console.error(err);
    });
});

// Endpoint Tsunami Terupdate
app.get('/tsunamiupdate', function(req, res) {
    getContent('http://data.bmkg.go.id/lasttsunami.xml')
    .then(function (data) {
        var jsonData = parser.toJson(data);
        res.type('application/json');
        res.send(jsonData);
    })
    .catch(function (err) {
        console.error(err);
    });
});

// Endpoint Peringatan
app.get('/peringatan', function(req, res) {
    getContent('http://data.bmkg.go.id/warninggeofisika.xml')
    .then(function (data) {
        var jsonData = parser.toJson(data);
        res.type('application/json');
        res.send(jsonData);
    })
    .catch(function (err) {
        console.error(err);
    });
});


app.listen(8000);
console.log("Server running at http://127.0.0.1:8000/");
