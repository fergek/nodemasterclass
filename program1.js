const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Cual es la base ? ", function(base) {
    rl.question("Cual es la altura ? ", function(altura) {
        console.log(`${base * altura}, seria la superficie del rectangulo`);
        rl.close();
    });
});

rl.on("close", function() {
    console.log("\nBYE BYE !!!");
    process.exit(0);
});