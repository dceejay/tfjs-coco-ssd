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

![Basic flow](https://user-images.githubusercontent.com/14224149/78177239-19fd4d00-745e-11ea-945c-ca854f8a7443.png)

```
[{"id":"b973e1df.278af","type":"inject","z":"908046f0.4b3e18","name":"Group of people","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":360,"y":440,"wires":[["7ab2187c.f98bb8"]]},{"id":"7ab2187c.f98bb8","type":"http request","z":"908046f0.4b3e18","name":"","method":"GET","ret":"bin","paytoqs":false,"url":"https://upload.wikimedia.org/wikipedia/commons/b/b3/Team_Queerala.jpg","tls":"","persist":false,"proxy":"","authType":"","x":590,"y":440,"wires":[["5afb8a2b.923554","353f2dee.c82c32"]]},{"id":"353f2dee.c82c32","type":"image","z":"908046f0.4b3e18","name":"","width":"250","data":"payload","dataType":"msg","thumbnail":false,"active":true,"x":800,"y":520,"wires":[]},{"id":"5afb8a2b.923554","type":"tensorflowCoco","z":"908046f0.4b3e18","name":"","model":"","scoreThreshold":0.5,"x":790,"y":440,"wires":[["4898c04f.70083"]]},{"id":"4898c04f.70083","type":"debug","z":"908046f0.4b3e18","name":"","active":true,"tosidebar":true,"console":false,"tostatus":true,"complete":"classes","targetType":"msg","x":1010,"y":440,"wires":[]},{"id":"49dfc2b8.2f241c","type":"inject","z":"908046f0.4b3e18","name":"Cars and persons","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":370,"y":500,"wires":[["ce3f799f.22b828"]]},{"id":"ce3f799f.22b828","type":"http request","z":"908046f0.4b3e18","name":"","method":"GET","ret":"bin","paytoqs":false,"url":"https://upload.wikimedia.org/wikipedia/commons/9/9d/Pedestrian_checking_before_crossing_the_road.jpg","tls":"","persist":false,"proxy":"","authType":"","x":590,"y":500,"wires":[["5afb8a2b.923554","353f2dee.c82c32"]]},{"id":"374f5762.280fb8","type":"inject","z":"908046f0.4b3e18","name":"Single car","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":340,"y":560,"wires":[["ce157e6e.fc42c"]]},{"id":"ce157e6e.fc42c","type":"http request","z":"908046f0.4b3e18","name":"","method":"GET","ret":"bin","paytoqs":false,"url":"https://upload.wikimedia.org/wikipedia/commons/c/cb/Old-style_VAZ_car_in_Kolpino_with_USSR-time_car_number.jpg","tls":"","persist":false,"proxy":"","authType":"","x":590,"y":560,"wires":[["5afb8a2b.923554","353f2dee.c82c32"]]},{"id":"27a49dbe.d5ebb2","type":"inject","z":"908046f0.4b3e18","name":"Multiple cars","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":350,"y":620,"wires":[["c96c475.c516cb8"]]},{"id":"c96c475.c516cb8","type":"http request","z":"908046f0.4b3e18","name":"","method":"GET","ret":"bin","paytoqs":false,"url":"https://upload.wikimedia.org/wikipedia/commons/3/36/Movement_and_cars.jpg","tls":"","persist":false,"proxy":"","authType":"","x":590,"y":620,"wires":[["5afb8a2b.923554","353f2dee.c82c32"]]},{"id":"d6b44491.f7eda8","type":"inject","z":"908046f0.4b3e18","name":"Pedestrians","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":350,"y":680,"wires":[["50e05316.349d4c"]]},{"id":"50e05316.349d4c","type":"http request","z":"908046f0.4b3e18","name":"","method":"GET","ret":"bin","paytoqs":false,"url":"https://upload.wikimedia.org/wikipedia/commons/3/3f/Pedestrian_crossing_street.jpg","tls":"","persist":false,"proxy":"","authType":"","x":590,"y":680,"wires":[["5afb8a2b.923554","353f2dee.c82c32"]]}]
```
All images used are freely-licensed offered by [Wikimedia Commons](https://commons.wikimedia.org/wiki/Commons:Welcome).
