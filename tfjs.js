
module.exports = function (RED) {
    function TensorFlowCoCo(n) {
        var fs = require('fs');
        var express = require("express");
        var compression = require("compression");

        /* suggestion from https://github.com/tensorflow/tfjs/issues/2029 */
        const nodeFetch = require('node-fetch'); // <<--- ADD
        global.fetch = nodeFetch; // <<--- ADD
        /* ************************************************************** */

        var tf = require('@tensorflow/tfjs-node');
        var cocoSsd = require('@tensorflow-models/coco-ssd');
        
        RED.nodes.createNode(this, n);
        this.scoreThreshold = n.scoreThreshould;
        this.maxDetections = n.maxDetections;
        this.passthru = n.passthru || false;
        this.modelUrl = n.modelUrl || undefined; // "http://localhost:1880/coco/model.json"
        var node = this;

        RED.httpNode.use(compression());
        RED.httpNode.use('/coco', express.static(__dirname + '/models/coco-ssd'));

        async function loadModel() {
            node.model = await cocoSsd.load({modelUrl: node.modelUrl});
            node.ready = true;
            node.status({fill:'green', shape:'dot', text:'Model ready'});
        }
        node.status({fill:'yellow', shape:'ring', text:'Loading model...'});
        loadModel();

        async function getImage(m) {
            fetch(m.payload)
                .then(r => r.buffer())
                .then(buf => m.payload = buf)
                .then(function() {reco(m) });
        }

        async function reco(m) {
            if (node.passthru === true) { m.image = m.payload; }
            var img = tf.node.decodeImage(m.payload);
            m.maxDetections = m.maxDetections || node.maxDetections || 20;
            m.payload = await node.model.detect(img, m.maxDetections);
            m.shape = img.shape;
            m.classes = {};
            m.scoreThreshold = m.scoreThreshold || node.scoreThreshold || 0.5;
            
            for (var i=0; i<m.payload.length; i++) {
                if (m.payload[i].score < m.scoreThreshold) {
                    m.payload.splice(i,1);
                    i = i - 1;
                }
            }
            for (var j=0; j<m.payload.length; j++) {
                m.classes[m.payload[j].class] = (m.classes[m.payload[j].class] || 0 ) + 1;
            }
            node.send(m);
            tf.dispose(img);
        }

        node.on('input', function (msg) {
            try {
                if (node.ready) {
                    msg.image = msg.payload;
                    if (typeof msg.payload === "string") { 
                        if (msg.payload.startsWith("http")) {
                            getImage(msg);
                            return;
                        }
                        else { msg.image = fs.readFileSync(msg.payload); }
                    }
                    reco(msg);
                }
            } catch (error) {
                node.error(error, msg);
            }
        });

        node.on("close", function () {
            node.status({});
        });
    }
    RED.nodes.registerType("tensorflowCoco", TensorFlowCoCo);
};
