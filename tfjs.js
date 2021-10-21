
module.exports = function (RED) {
    function TensorFlowCoCo(n) {
        var fs = require('fs');
        var path = require('path');
        var jpeg = require('jpeg-js');
        var express = require("express");
        var pureimage = require("pureimage");
        var compression = require("compression");

        /* suggestion from https://github.com/tensorflow/tfjs/issues/2029 */
        const nodeFetch = require('node-fetch'); // <<--- ADD
        global.fetch = nodeFetch; // <<--- ADD
        /* ************************************************************** */

        var tf = require('@tensorflow/tfjs-node');
        var cocoSsd = require('@tensorflow-models/coco-ssd');

        RED.nodes.createNode(this, n);
        this.scoreThreshold = n.scoreThreshold;
        this.maxDetections = n.maxDetections;
        this.passthru = n.passthru || "false";
        this.modelUrl = n.modelUrl || undefined; // "http://localhost:1880/coco/model.json"
        this.lineColour = n.lineColour || "magenta";
        var node = this;

        RED.httpNode.use(compression());
        RED.httpNode.use('/coco', express.static(__dirname + '/models/coco-ssd'));

        async function loadFont() {
            node.fnt = pureimage.registerFont(path.join(__dirname,'./SourceSansPro-Regular.ttf'),'Source Sans Pro');
            node.fnt.load();
        }
        loadFont();

        async function loadModel() {
            if (node.modelUrl === "local") {
                node.modelUrl = "http://localhost:"+RED.settings.uiPort+RED.settings.httpNodeRoot+"coco/model.json";
            }
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
            var jimg;

            if (node.passthru === "bbox") { jimg = jpeg.decode(m.payload); }
            if (node.passthru === "true") { m.image = m.payload; }
            var img = tf.node.decodeImage(m.payload);

            m.maxDetections = m.maxDetections || node.maxDetections || 40;
            m.payload = await node.model.detect(img, m.maxDetections);
            m.shape = img.shape;
            m.classes = {};
            m.scoreThreshold = m.scoreThreshold || node.scoreThreshold || 0.5;

            for (var i=0; i<m.payload.length; i++) {
                if (m.payload[i].score < m.scoreThreshold) {
                    m.payload.splice(i,1);
                    i = i - 1;
                }
                m.classes[m.payload[i].class] = (m.classes[m.payload[i].class] || 0 ) + 1;
            }

            if (node.passthru === "bbox") {
                var pimg = pureimage.make(jimg.width,jimg.height);
                var ctx = pimg.getContext('2d');
                var scale = parseInt((jimg.width + jimg.height) / 500 + 0.5);
                ctx.bitmap.data = jimg.data;
                for (var k=0; k<m.payload.length; k++) {
                    ctx.fillStyle = node.lineColour;
                    ctx.strokeStyle = node.lineColour;
                    ctx.font = scale*8+"pt 'Source Sans Pro'";
                    ctx.fillText(m.payload[k].class, m.payload[k].bbox[0] + 4, m.payload[k].bbox[1] - 4)
                    ctx.lineWidth = scale;
                    ctx.lineJoin = 'bevel';
                    ctx.rect(m.payload[k].bbox[0], m.payload[k].bbox[1], m.payload[k].bbox[2], m.payload[k].bbox[3]);
                    ctx.stroke();
                }
                m.image = jpeg.encode(pimg,70).data;
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
                        else if (msg.payload.startsWith("data:image/jpeg")) {
                            msg.payload = Buffer.from(msg.payload.split(";base64,")[1], 'base64');
                        }
                        else { msg.payload = fs.readFileSync(msg.payload); }
                    }
                    reco(msg);
                }
            } catch (error) {
                node.error(error, msg);
            }
        });

        node.on("close", function () {
            node.status({});
            node.ready = false;
            node.model = null;
            node.fnt = null;
        });
    }
    RED.nodes.registerType("tensorflowCoco", TensorFlowCoCo);
};
