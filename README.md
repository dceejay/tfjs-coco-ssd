# node-red-contrib-tfjs-coco-ssd

A Node-RED node for Object Detection using TensorFlowJS CoCo SSD.

**NOTE**: The Tensorflow.js library will be installed automatically.  However Tensorflow.js is only available on certain OS/Hardware/processor combinations.  Therfore it might not automatically work on all platforms, if you are unlucky...

## Install

Either use the Node-RED Menu - Manage Palette option, or run the following command in your Node-RED user directory - typically `~/.node-red`

    npm i node-red-contrib-tfjs-coco-ssd

## Overview

This node runs the CoCo Single Shot object detector on a ***jpg image***, delivered via an ```msg.payload``` in one of the following formats:
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

The following example flow shows how to recognize these object classes in an input image.  Note that this flow requires that the ***node-red-contrib-image-output*** is installed, to be able to display the analyzed jpg images!

The recognition results will be displayed in the debug node's status:

![Basic flow](https://user-images.githubusercontent.com/14224149/78180237-c5a89c00-7462-11ea-80f7-fb6b7637f718.png)

```
[{"id":"10b30e95.217c11","type":"inject","z":"908046f0.4b3e18","name":"Group of people","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":340,"y":420,"wires":[["e0c0019d.3aec4"]]},{"id":"e0c0019d.3aec4","type":"http request","z":"908046f0.4b3e18","name":"","method":"GET","ret":"bin","paytoqs":false,"url":"https://upload.wikimedia.org/wikipedia/commons/b/b3/Team_Queerala.jpg","tls":"","persist":false,"proxy":"","authType":"","x":570,"y":420,"wires":[["d4362786.bb5408"]]},{"id":"a2f1b4a5.629598","type":"image","z":"908046f0.4b3e18","name":"","width":"250","data":"image","dataType":"msg","thumbnail":false,"active":true,"x":1000,"y":500,"wires":[]},{"id":"d4362786.bb5408","type":"tensorflowCoco","z":"908046f0.4b3e18","name":"","modelUrl":"","scoreThreshold":0.5,"passthru":true,"x":770,"y":420,"wires":[["17f906e.e5c01f9","a2f1b4a5.629598"]]},{"id":"17f906e.e5c01f9","type":"debug","z":"908046f0.4b3e18","name":"","active":true,"tosidebar":true,"console":false,"tostatus":true,"complete":"classes","targetType":"msg","x":990,"y":420,"wires":[]},{"id":"ef7ee674.7ef788","type":"inject","z":"908046f0.4b3e18","name":"Cars and persons","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":350,"y":480,"wires":[["30d9f1be.81073e"]]},{"id":"30d9f1be.81073e","type":"http request","z":"908046f0.4b3e18","name":"","method":"GET","ret":"bin","paytoqs":false,"url":"https://upload.wikimedia.org/wikipedia/commons/9/9d/Pedestrian_checking_before_crossing_the_road.jpg","tls":"","persist":false,"proxy":"","authType":"","x":570,"y":480,"wires":[["d4362786.bb5408"]]},{"id":"d7828810.745d78","type":"inject","z":"908046f0.4b3e18","name":"Single car","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":320,"y":540,"wires":[["83db96c9.7d5e58"]]},{"id":"83db96c9.7d5e58","type":"http request","z":"908046f0.4b3e18","name":"","method":"GET","ret":"bin","paytoqs":false,"url":"https://upload.wikimedia.org/wikipedia/commons/c/cb/Old-style_VAZ_car_in_Kolpino_with_USSR-time_car_number.jpg","tls":"","persist":false,"proxy":"","authType":"","x":570,"y":540,"wires":[["d4362786.bb5408"]]},{"id":"8bd09fbf.87863","type":"inject","z":"908046f0.4b3e18","name":"Multiple cars","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":330,"y":600,"wires":[["bc03bd68.555cb"]]},{"id":"bc03bd68.555cb","type":"http request","z":"908046f0.4b3e18","name":"","method":"GET","ret":"bin","paytoqs":false,"url":"https://upload.wikimedia.org/wikipedia/commons/3/36/Movement_and_cars.jpg","tls":"","persist":false,"proxy":"","authType":"","x":570,"y":600,"wires":[["d4362786.bb5408"]]},{"id":"f3f55188.58dbe","type":"inject","z":"908046f0.4b3e18","name":"Pedestrians","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":330,"y":660,"wires":[["6c6ff047.c606d"]]},{"id":"6c6ff047.c606d","type":"http request","z":"908046f0.4b3e18","name":"","method":"GET","ret":"bin","paytoqs":false,"url":"https://upload.wikimedia.org/wikipedia/commons/3/3f/Pedestrian_crossing_street.jpg","tls":"","persist":false,"proxy":"","authType":"","x":570,"y":660,"wires":[["d4362786.bb5408"]]}]
```
All images used are freely-licensed offered by [Wikimedia Commons](https://commons.wikimedia.org/wiki/Commons:Welcome).
