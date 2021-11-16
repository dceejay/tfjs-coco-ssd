#!/usr/bin/env node

var os = require("os");
var fs = require("fs");

if (os.type() === "Windows_NT" ) {
    if (fs.existsSync('../@tensorflow/tfjs-node/deps/lib/tensorflow.dll')) {
        console.log('The dep dll exists');
        fs.copyFileSync('../@tensorflow/tfjs-node/deps/lib/tensorflow.dll','../@tensorflow/tfjs-node/lib/napi-v*/'); //,fs.constants.COPYFILE_EXCL);
        console.log("Copied across")
    }
}
