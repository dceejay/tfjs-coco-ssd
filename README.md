# node-red-contrib-tfjs-coco-ssd

A Node-RED node for Object Detection using TensorFlowJS CoCo SSD.

**NOTE**: The Tensorflow.js library will be installed automatically.  However Tensorflow.js is only available on certain OS/Hardware/processor combinations.  Therfore it might not automatically work on all platforms, if you are unlucky...

## Install

Either use the Node-RED Menu - Manage Palette option, or run the following command in your Node-RED user directory - typically `~/.node-red`

    npm i node-red-contrib-tfjs-coco-ssd

## Overview

This node runs the CoCo Single Shot object detector on a jpg image, delivered via an ```msg.payload``` in one of the following formats:
+ As a string, that represents a file path
+ As a buffer

The [CoCo-ssd](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) model is loaded locally so it should work offline.  

The model is currently trained to recognize the following object classes in an image:

*person, bicycle, car, motorcycle, airplane, bus, train, truck, traffic light, fire hydrant, stop sign, parking meter, bird, cat, dog, horse, sheep, cow, elephant, bear, zebra, giraffe, backpack, umbrella, handbag, tie, suitcase, frisbee, skis, snowboard, sports ball, kite, baseball glove, skateboard, surfboard, tennis racket, bottle, wine glass, cup, fork, knife, spoon, bowl, banana, apple, sandwhich, orange, broccoli, carrot, pizza, donut, cake, chair, couch, potted plant, bed, dining table, toilet, tv, laptop, mouse, remote,, keyboard, cell phone, microwave, oven, toaster, sink, refrigerator, book, clock, vase, scissor, teddy bear, hair drier, toothbrush*

## Node usage

The following example will demonstrate how easy it is to use artificial intelligence in a Node-RED flow, to recognize objects in images.

**TIP**: avoid adding too much CoCo-ssd nodes in a flow, to avoid long startup times (for loading the same model N times).   So from a performance point of view, it is better to reuse a single coco-ssd node for multiple sources.  Although multiple CoCo-ssd nodes allows running multiple recognitions in parallel.

### Basic example

Some of the supported object types (like cars, persons, ...) are very useful in a typical IOT environment, e.g. to implement a video surveillance application in Node-RED.

The following example flow shows how to recognize these object classes in an input image.  Look at the debug node status to see the recognition results:

![Basic flow](https://user-images.githubusercontent.com/14224149/77361314-5b4f7780-6d4f-11ea-90ef-50fe8e894093.png)

```
[{"id":"4ce4e70f.7363f8","type":"inject","z":"eda68f25.e31b3","name":"Detect fruits","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":370,"y":2120,"wires":[["685c92d1.fb5bcc"]]},{"id":"685c92d1.fb5bcc","type":"http request","z":"eda68f25.e31b3","name":"","method":"GET","ret":"bin","paytoqs":false,"url":"https://user-images.githubusercontent.com/14224149/77360575-e3cd1880-6d4d-11ea-92f0-771e4c8913d1.png","tls":"","persist":false,"proxy":"","authType":"","x":550,"y":2120,"wires":[["b68e8c16.b1c9"]]},{"id":"d5e66be2.e63288","type":"image","z":"eda68f25.e31b3","name":"","width":160,"data":"payload","dataType":"msg","thumbnail":false,"active":true,"x":960,"y":2200,"wires":[]},{"id":"b68e8c16.b1c9","type":"tensorflowCoco","z":"eda68f25.e31b3","name":"","model":"","scoreThreshold":0.5,"x":750,"y":2120,"wires":[["ec483b1e.5592a8","d5e66be2.e63288"]]},{"id":"ec483b1e.5592a8","type":"debug","z":"eda68f25.e31b3","name":"","active":true,"tosidebar":true,"console":false,"tostatus":true,"complete":"classes","targetType":"msg","x":950,"y":2120,"wires":[]},{"id":"92accf91.41feb","type":"inject","z":"eda68f25.e31b3","name":"Detect single car","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":360,"y":2180,"wires":[["394e1c90.1c6084"]]},{"id":"394e1c90.1c6084","type":"http request","z":"eda68f25.e31b3","name":"","method":"GET","ret":"bin","paytoqs":false,"url":"https://user-images.githubusercontent.com/14224149/77360621-fba49c80-6d4d-11ea-8135-ea37578a71b5.png","tls":"","persist":false,"proxy":"","authType":"","x":550,"y":2180,"wires":[["b68e8c16.b1c9"]]},{"id":"4ab77fc3.613ac","type":"inject","z":"eda68f25.e31b3","name":"Detect multiple cars","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":350,"y":2240,"wires":[["9b6cf3d1.8fe5f"]]},{"id":"9b6cf3d1.8fe5f","type":"http request","z":"eda68f25.e31b3","name":"","method":"GET","ret":"bin","paytoqs":false,"url":"https://user-images.githubusercontent.com/14224149/77360665-0f500300-6d4e-11ea-96fd-1a49dec715a3.png","tls":"","persist":false,"proxy":"","authType":"","x":550,"y":2240,"wires":[["b68e8c16.b1c9"]]},{"id":"bdd45cd8.619ba","type":"inject","z":"eda68f25.e31b3","name":"Detect persons","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":360,"y":2300,"wires":[["2ce67815.90a258"]]},{"id":"2ce67815.90a258","type":"http request","z":"eda68f25.e31b3","name":"","method":"GET","ret":"bin","paytoqs":false,"url":"https://user-images.githubusercontent.com/14224149/77360706-2262d300-6d4e-11ea-860d-ee6c5af1c832.png","tls":"","persist":false,"proxy":"","authType":"","x":550,"y":2300,"wires":[["b68e8c16.b1c9"]]},{"id":"dd8c0899.9f3d78","type":"inject","z":"eda68f25.e31b3","name":"Detect person behind","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":340,"y":2360,"wires":[["df5fea5c.8c64b8"]]},{"id":"df5fea5c.8c64b8","type":"http request","z":"eda68f25.e31b3","name":"","method":"GET","ret":"bin","paytoqs":false,"url":"https://user-images.githubusercontent.com/14224149/77360761-37d7fd00-6d4e-11ea-9648-abf352a26707.png","tls":"","persist":false,"proxy":"","authType":"","x":550,"y":2360,"wires":[["b68e8c16.b1c9"]]},{"id":"46a4be89.a8156","type":"inject","z":"eda68f25.e31b3","name":"Detect person behind","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":340,"y":2420,"wires":[["d9257e81.e3a7f"]]},{"id":"d9257e81.e3a7f","type":"http request","z":"eda68f25.e31b3","name":"","method":"GET","ret":"bin","paytoqs":false,"url":"https://user-images.githubusercontent.com/14224149/77360798-50e0ae00-6d4e-11ea-9c3c-22dac1492d13.png","tls":"","persist":false,"proxy":"","authType":"","x":550,"y":2420,"wires":[["b68e8c16.b1c9"]]}]
```
