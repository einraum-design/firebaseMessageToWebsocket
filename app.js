"use strict";

const WebSocketServer = require('ws').Server;

const FBase = require('./modules/firebase_tr');
const Helper = require('./modules/helper');
const SESSION_ID = Helper.guid();

const wss = new WebSocketServer({port: 8080});

FBase.initialize();

var CLIENTS = [];

//console.log(FBase.readData('/self'));


// react to messeges:
wss.on('connection', (ws) => {
	console.log('client connected');
    CLIENTS.push(ws);

    ws.on('message', (message) => {
        console.log('received: %s', message);
    });
    /*ws.send('something');
    console.log("something");*/

    ws.on('close', (client) =>{
    	console.log('client disconnected');
        CLIENTS.splice(CLIENTS.indexOf(client), 1);
    });

    ws.on('error', (client) => {
    	console.log('client error');
        CLIENTS.splice(CLIENTS.indexOf(client), 1);
    });
});


FBase.database.ref('lights').on('value', function (snapshot){
        //console.log(snapshot.val());
        var message = snapshot.val();
        console.log("light data changed: " + JSON.stringify(message));
        //ws.send(JSON.stringify(result));
        sendAll(JSON.stringify(message));
});

FBase.database.ref('sound').on('value', function (snapshot){
        //console.log(snapshot.val());
        var message = snapshot.val();
        console.log("sound date changed: " + JSON.stringify(message));
        //ws.send(JSON.stringify(result));
        sendAll(JSON.stringify(message));
});

function sendAll(message){
	for(var i = 0; i<CLIENTS.length; i++){
		if(CLIENTS[i].readyState == CLIENTS[0].OPEN){
			CLIENTS[i].send(message);
		}
	}
}



