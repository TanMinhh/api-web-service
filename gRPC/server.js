const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const PROTO_PATH = path.join(__dirname, "greeter.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition).greeter;

function sayHi(call, callback) {
    const reply = { message: `Hi, ${call.request.name}!` };
    callback(null, reply);
}

function getNumbers(call) {
    const count = call.request.count;
    let current = 1;
    const interval = setInterval(() => {
        if (current > count) {
            clearInterval(interval);
            call.end();
            return;
        }
        call.write({ order: current, number: current * 100 });
        current++;
    }, 1000);
}

function sumNumbers(call, callback) {
    let sum = 0;
    call.on("data", (request) => {
        sum += request.number;
    });
    call.on("end", () => {
        callback(null, { sum });
    });
}

const clients = [];
function chat(call) {
    const metadata = call.metadata.get('user');
    const username = metadata.length > 0 ? metadata[0] : 'Unknown';
    console.log("New client connected:", username);
    call.username = username;

    const currentUsers = clients.map(c => c.username).join(', ');
    const memberCount = clients.length;

    let welcomeMessage = "";
    if (memberCount < 1) {
        welcomeMessage = "You are the first to join the chat";
    }
    else {
        welcomeMessage = `Already in room: ${currentUsers}`;
    }

    call.write({
        user: "Server",
        message: welcomeMessage,
        timestamp: Date.now()
    });

    clients.forEach(client => {
        client.write({
            user: "Server",
            message: `${username} has joined the chat`,
            timestamp: Date.now()
        });
    });
    clients.push(call);

    call.on("data", (chatMessage) => {
        const time = new Date(Number(chatMessage.timestamp)).toLocaleTimeString();
        console.log(`[${time}] - ${chatMessage.user}: ${chatMessage.message}`);
        clients.forEach(client => {
            if (client != call) {
                client.write({
                    user: chatMessage.user,
                    message: chatMessage.message,
                    timestamp: chatMessage.timestamp
                });
            }
        })
    });
    call.on("end", () => {
        clients.splice(clients.indexOf(call), 1);
        clients.forEach(client => {
            client.write({
                user: "Server",
                message: `${username} has left the chat`,
                timestamp: Date.now()
            });
        });
        call.end();
    });
}

function main() {
    const server = new grpc.Server();
    server.addService(proto.Greeter.service, { SayHi: sayHi, GetNumbers: getNumbers, SumNumbers: sumNumbers, Chat: chat });
    server.bindAsync('0.0.0.0:5050', grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error("Failed to bind", err);
            return;
        }
        console.log(`Server is running on port ${port}`);
    });
}

main();