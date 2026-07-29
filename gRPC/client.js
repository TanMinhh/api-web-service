const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const PROTO_PATH = path.join(__dirname, "greeter.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const proto = grpc.loadPackageDefinition(packageDefinition).greeter;
const readline = require("readline");
const username = process.argv[2] || "meh";

function main() {
    const client = new proto.Greeter("localhost:5050", grpc.credentials.createInsecure());
    /*
    //Say Hi func
    client.SayHi({ name: "Meh" }, (err, response) => {
        if (err) console.error(err);
        else console.log(response.message);
    });

    //Get numbers func
    const callGetNumbers = client.GetNumbers({ count: 5 });
    callGetNumbers.on("data", (response) => {
        console.log(`Order ${response.order} - Number ${response.number}`);
    });
    callGetNumbers.on("end", () => {
        console.log("Stream ended");
    });

    //Sum numbers func
    const callSumNumbers = client.SumNumbers((err, response) => {
        if (err) return console.error(err);
        console.log("Sum: ", response.sum);
    });
    callSumNumbers.write({ number: 23 });
    callSumNumbers.write({ number: 12 });
    callSumNumbers.write({ number: 2004 });
    callSumNumbers.end();
    */

    //Chat func
    const metadata = new grpc.Metadata();
    metadata.add('user', username);
    const callChat = client.Chat(metadata);
    callChat.on("data", (chatMessage) => {
        const time = new Date(Number(chatMessage.timestamp)).toLocaleTimeString();
        console.log(`[${time}] - ${chatMessage.user}: ${chatMessage.message}`);
    });

    callChat.on("end", () => {
        console.log("Stream closed");
        process.exit(0);
    });

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    console.log("Start chatting (Type Block to leave): ");
    rl.on("line", (line) => {
        if (line.trim() === "Block") {
            callChat.end();
            rl.close();
            return;
        }
        callChat.write({
            user: username,
            message: line,
            timestamp: Date.now()
        })
    });
}

main();