# node-red-contrib-tfjs-coco-ssd
[![platform](https://img.shields.io/badge/platform-Node--RED-red)](https://nodered.org)

A Node-RED node for Object Detection using TensorFlowJS CoCo SSD.

**NOTE**: The Tensorflow.js library will be installed automatically.  However Tensorflow.js is only available on certain OS/Hardware/processor combinations.  Therfore it might not automatically work on all platforms, if you are unlucky...

## Install

Either use the Node-RED Menu - Manage Palette option, or run the following command in your Node-RED user directory - typically `~/.node-red`

    npm i node-red-contrib-tfjs-coco-ssd

## Overview

This node runs the CoCo Single Shot object detector on a ***jpeg image***, delivered via an ```msg.payload``` in one of the following formats:
+ As a string, that represents a file path to a jpg file.
+ As a buffer of a jpg.
+ As an https url that returns a jpg.
+ As an html data:image/jpeg;base64, string

The [CoCo-ssd](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) model is loaded locally so it should work offline.

The model is currently trained to recognize the following object classes in an image:

*person, bicycle, car, motorcycle, airplane, bus, train, truck, traffic light, fire hydrant, stop sign, parking meter, bird, cat, dog, horse, sheep, cow, elephant, bear, zebra, giraffe, backpack, umbrella, handbag, tie, suitcase, frisbee, skis, snowboard, sports ball, kite, baseball glove, skateboard, surfboard, tennis racket, bottle, wine glass, cup, fork, knife, spoon, bowl, banana, apple, sandwhich, orange, broccoli, carrot, pizza, donut, cake, chair, couch, potted plant, bed, dining table, toilet, tv, laptop, mouse, remote,, keyboard, cell phone, microwave, oven, toaster, sink, refrigerator, book, clock, vase, scissor, teddy bear, hair drier, toothbrush*

## Node usage

The following example will demonstrate how easy it is to recognize objects in images.

**TIP**: avoid adding too many CoCo-ssd nodes in a flow. This avoids long startup times (due to loading the same model N times).  From a performance point of view, it is better to reuse a single coco-ssd node for multiple sources if at all possible.

### Basic example

Some of the supported object types (like cars, persons, ...) are very useful in a typical IOT environment, e.g. to implement a video surveillance application in Node-RED.

The following example flow shows how to recognize these object classes in an input image.  Note that this flow requires that the ***node-red-contrib-image-output*** is installed, to be able to display the analyzed jpg images!

The recognition results will be displayed in the debug node's status:

![Basic flow](https://user-images.githubusercontent.com/14224149/78180237-c5a89c00-7462-11ea-80f7-fb6b7637f718.png)

```
[{"id":"9798f509.db7bc8","type":"inject","z":"eeee575.b4b80a8","name":"Group of people","repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":220,"y":780,"wires":[["d6d7a98f.929108"]]},{"id":"d6d7a98f.929108","type":"http request","z":"eeee575.b4b80a8","name":"","method":"GET","ret":"bin","paytoqs":false,"url":"https://upload.wikimedia.org/wikipedia/commons/b/b3/Team_Queerala.jpg","tls":"","persist":false,"proxy":"","authType":"","x":450,"y":780,"wires":[["3e623d1a.c9fd42"]]},{"id":"3e623d1a.c9fd42","type":"tensorflowCoco","z":"eeee575.b4b80a8","name":"","modelUrl":"http://localhost:1880/coco/model.json","scoreThreshold":0.5,"passthru":"bbox","x":650,"y":780,"wires":[["14fa8ce2.fc7043","4ec7b21f.c2d45c"]]},{"id":"fa56b166.50b0d","type":"http request","z":"eeee575.b4b80a8","name":"","method":"GET","ret":"bin","paytoqs":false,"url":"https://upload.wikimedia.org/wikipedia/commons/9/9d/Pedestrian_checking_before_crossing_the_road.jpg","tls":"","persist":false,"proxy":"","authType":"","x":450,"y":840,"wires":[["3e623d1a.c9fd42"]]},{"id":"bc6d8978.d30338","type":"http request","z":"eeee575.b4b80a8","name":"","method":"GET","ret":"bin","paytoqs":false,"url":"https://upload.wikimedia.org/wikipedia/commons/c/cb/Old-style_VAZ_car_in_Kolpino_with_USSR-time_car_number.jpg","tls":"","persist":false,"proxy":"","authType":"","x":450,"y":900,"wires":[["3e623d1a.c9fd42"]]},{"id":"17e6db88.6c8274","type":"http request","z":"eeee575.b4b80a8","name":"","method":"GET","ret":"bin","paytoqs":false,"url":"https://upload.wikimedia.org/wikipedia/commons/3/36/Movement_and_cars.jpg","tls":"","persist":false,"proxy":"","authType":"","x":450,"y":960,"wires":[["3e623d1a.c9fd42"]]},{"id":"2666c156.8217fe","type":"http request","z":"eeee575.b4b80a8","name":"","method":"GET","ret":"bin","paytoqs":false,"url":"https://upload.wikimedia.org/wikipedia/commons/3/3f/Pedestrian_crossing_street.jpg","tls":"","persist":false,"proxy":"","authType":"","x":450,"y":1020,"wires":[["3e623d1a.c9fd42"]]},{"id":"14fa8ce2.fc7043","type":"debug","z":"eeee575.b4b80a8","name":"","active":true,"tosidebar":true,"console":false,"tostatus":true,"complete":"classes","targetType":"msg","x":870,"y":780,"wires":[]},{"id":"4ec7b21f.c2d45c","type":"image","z":"eeee575.b4b80a8","name":"","width":"250","data":"image","dataType":"msg","thumbnail":false,"active":true,"outputs":0,"x":880,"y":860,"wires":[]},{"id":"2b3074e9.e13fbc","type":"inject","z":"eeee575.b4b80a8","name":"Cars and persons","repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":230,"y":840,"wires":[["fa56b166.50b0d"]]},{"id":"fa7c8056.39de2","type":"inject","z":"eeee575.b4b80a8","name":"Single car","repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":200,"y":900,"wires":[["bc6d8978.d30338"]]},{"id":"68490c5d.480394","type":"inject","z":"eeee575.b4b80a8","name":"Multiple cars","repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":210,"y":960,"wires":[["17e6db88.6c8274"]]},{"id":"9b5463ca.5bc32","type":"inject","z":"eeee575.b4b80a8","name":"Pedestrians","repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"","payloadType":"date","x":210,"y":1020,"wires":[["2666c156.8217fe"]]}]
```
All images used are freely-licensed offered by [Wikimedia Commons](https://commons.wikimedia.org/wiki/Commons:Welcome).
