#!/usr/bin/env node

var os = require("os");
var fs = require("fs");
console.log("We are at",process.cwd());
console.log("We dir at",__dirname);

if (os.type() === "Windows_NT" ) {
    if (!fs.existsSync('../@tensorflow/tfjs-node/lib/napi-v5/tensorflow.dll')) {
        console.log("The lib dll doesn't exist.");
        if (fs.existsSync('../@tensorflow/tfjs-node/deps/lib/tensorflow.dll')) {
            console.log('The dep dll exists');
            fs.copyFileSync('../@tensorflow/tfjs-node/deps/lib/tensorflow.dll','../@tensorflow/tfjs-node/lib/napi-v5/tensorflow.dll');
            console.log("Copied across")
        }
    }
}
