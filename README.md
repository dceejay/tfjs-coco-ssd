node-red-contrib-tfjs-coco-ssd
==============================

A Node-RED node for Object Detection using TensorFlowJS CoCo SSD.

**NOTE**: Tensorflow.js is only available on certain OS/Hardware/processor combinations.
It does not autimatically install/work on all platforms. You may be unlucky.

Install
-------
Either use the Node-RED Menu - Manage Palette option, or run the following command in your Node-RED user directory - typically `~/.node-red`

    npm i node-red-contrib-tfjs-coco-ssd

Overview
--------

Runs the CoCo Single Shot object detector against either a file or a buffer of a jpg image.
The model is loaded locally so it should work offline.
