function init() {
     if (window.goSamples) goSamples(); // init for these samples -- you don't need to call this
     var $ = go.GraphObject.make; //for conciseness in defining node templates

     myDiagram =
         $(go.Diagram, "myDiagram", //Diagram refers to its DIV HTML element by id
            {
                initialContentAlignment: go.Spot.Center,
                "undoManager.isEnabled": true,
                maxScale: 2.7,
                minScale: 0.4,
                click: onSelectionChanged,
                initialAutoScale: go.Diagram.Uniform,
                // when a node is selected, show popup 
                nodeSelectionAdornmentTemplate:
                    $(go.Adornment, "Auto",
                        new go.Binding("locationSpot", "key", function(key, node) {
                                var widthOfTheAdornment = 300;
                                var heightOfTheAdornment = 500;
                                if ( node.location.x < (myDiagram.viewportBounds.x + widthOfTheAdornment) ) {
                                    if ( node.location.y > (myDiagram.viewportBounds.y + myDiagram.viewportBounds.height - heightOfTheAdornment) ) {
                                        return go.Spot.BottomLeft;
                                    } else if ( node.location.y < (myDiagram.viewportBounds.y + heightOfTheAdornment) ) {
                                        return go.Spot.TopLeft;
                                    } else {
                                        return go.Spot.Left;
                                    }
                                } else if ( node.location.x > (myDiagram.viewportBounds.x + myDiagram.viewportBounds.width - widthOfTheAdornment) ) {
                                    if ( node.location.y > (myDiagram.viewportBounds.y + myDiagram.viewportBounds.height - heightOfTheAdornment) ) {
                                        return go.Spot.BottomRight;
                                    } else if ( node.location.y < (myDiagram.viewportBounds.y + heightOfTheAdornment) ) {
                                        return go.Spot.TopRight;
                                    } else {
                                        return go.Spot.Right;
                                    }
                                } else if (node.location.y > (myDiagram.viewportBounds.y + myDiagram.viewportBounds.height - heightOfTheAdornment) ) {
                                    return go.Spot.Bottom;
                                } else if ( node.location.y < (myDiagram.viewportBounds.y + heightOfTheAdornment) ) {
                                    return go.Spot.Top;
                                }
                            }
                        ),
                        $(go.Shape,
                            "RoundedRectangle", 
                            {stroke: "#d3d8db",fill: "white", width: 320,margin:50},
                            new go.Binding("height", "Status", function(c) {
                                switch (c) {
                                    case "Ok": 
                                        return 219;
                                        break;
                                    case "Warning": 
                                        return 370;
                                        break;
                                    case "Error": 
                                        return 370;
                                        break;
                                }
                            })
                        ),
                        $(go.Panel, 
                            "Vertical",
                            // device name
                            $(go.Panel, 
                                "Auto",
                                { margin:0, width:320, height: 30},
                                $(go.Shape, { margin: 0, stroke:null, fill: "#fafafa" }),
                                $(go.TextBlock, 
                                    { margin: 0, alignment: go.Spot.Center, stroke: "#031c36", font: "bold 1em 'Source Sans Pro',sans-serif" }, 
                                    new go.Binding("text", "Name")
                                )
                            ),
                            // bottom Border
                            $(go.Panel, "Auto",{ margin:0, width:320, height:0.5,background:"#cdcdce"}),
                            // device activity
                            $(go.Panel, 
                                "Vertical",
                                { margin:0, width:320,background:null},
                                new go.Binding("visible", "Status", function(c) {
                                    switch (c) {
                                        case "Ok":
                                            return false;
                                            break;
                                    }
                                }),
                                //Top Space
                                $(go.Panel, "Auto",{ margin:0, width:320, height:4}),
                                //Top Space
                                $(go.Panel, "Auto",{ margin:0, width:320, height:1}),
                                $(go.TextBlock, {
                                    margin: 10,
                                    alignment: go.Spot.Left,
                                    stroke: "#031c36",
                                    font: "bold 0.8em 'Source Sans Pro',sans-serif",
                                    text: "LATEST ACTIVITY"
                                }),
                                //Top Space
                                $(go.Panel, "Auto",{ margin:0, width:320, height:4}),
                                $(go.Panel, "Vertical",
                                    { margin: new go.Margin(0, 0, 10, 0), width:320,background:"#fcf2f3"},
                                    new go.Binding("background", "Status", function(c) {
                                        switch (c) {
                                            case "Warning":
                                                return "#faf7f0";
                                                break;
                                            case "Error":
                                                return "#fcf2f3";
                                                break;
                                        }
                                    }),
                                    //bottom Border
                                    $(go.Panel, "Auto",
                                        { margin: new go.Margin(0, 0, 10, 0), width:320, height:0.5},
                                        new go.Binding("background", "Status", function(c) {
                                            switch (c) {
                                                case "Warning":
                                                    return "#f8b023";
                                                    break;
                                                case "Error":
                                                    return "#d0021b";
                                                    break;
                                            }
                                        })
                                    ),
                                    //Title
                                    $(go.TextBlock, 
                                        {
                                            margin: new go.Margin(0, 10, 10, 10),
                                            alignment: go.Spot.Left,
                                            font: "bold 13px 'Source Sans Pro',sans-serif",
                                            text:"Exceeded the threshold temperature."
                                        },
                                        new go.Binding("stroke", "Status", function(c) {
                                            switch (c) {
                                                case "Warning":
                                                    return "#f8b023";
                                                    break;
                                                case "Error":
                                                    return "red";
                                                    break;
                                            }
                                        })
                                    ),
                                    //Details
                                    $(go.TextBlock, {
                                        margin: new go.Margin(0, 10, 10, 10),
                                        alignment: go.Spot.Left,
                                        stroke: "#031c36",
                                        font: "1em 'Source Sans Pro',sans-serif",
                                        text:"Temperature for the device exceeded the normal ranges for 23 minutes, but did not near the maximum-rated temperature."
                                    }),
                                    $("Button",
                                        { alignment: go.Spot.Right,click: onSelectionChanged, margin: 10},
                                        $(go.TextBlock, "More info",{ stroke:"black",background:"white",font: "1em 'Source Sans Pro',sans-serif"})
                                    ),
                                    //Space
                                    $(go.Panel, "Auto",{ margin:0, width:320, height:4}),
                                    //bottom Border
                                    $(go.Panel, "Auto",{ margin:0, width:320, height:0.5},
                                        new go.Binding("background", "Status", function(c) {
                                            switch (c) {
                                                case "Warning":
                                                    return "#f8b023";
                                                    break;
                                                case "Error":
                                                    return "#d0021b";
                                                    break;
                                            }
                                        })
                                    )
                                )
                            ),
                            // device stats
                            //Top Space
                            $(go.Panel, "Auto",{ margin:0, width:320, height:10}),
                            $(go.TextBlock, {
                                margin: new go.Margin(0, 0, 10, 10),
                                alignment: go.Spot.Left,
                                stroke: "#031c36",
                                font: "bold 11px 'Source Sans Pro',sans-serif",
                                text: "STATS"
                                }
                            ),
                            //bottom Border
                            $(go.Panel, "Auto",{ margin:0, width:320, height:0.5,background:"#cdcdce"}),
                            //Space
                            $(go.Panel, "Auto",{ margin:0, width:320, height:10}), 
                            //Information content 
                            $(go.Panel, "Horizontal",
                                { margin: 0, width:320},
                                $(go.Panel, "Vertical",
                                    { margin: new go.Margin(10, 5, 10, 10), alignment: go.Spot.Left, width: 150,background:null},
                                    $(go.TextBlock, 
                                        {
                                            margin: 0,
                                            alignment: go.Spot.Left,
                                            stroke: "black",
                                            text: "2340",
                                            font: "3em 'Source Sans Pro',sans-serif"
                                        }, 
                                        new go.Binding("text", "Temperature")
                                    ),
                                    $(go.TextBlock, {
                                        margin: new go.Margin(3, 0, 0, 0),
                                        alignment: go.Spot.Left,
                                        stroke: "#031c36",
                                        font: "bold 0.8em 'Source Sans Pro',sans-serif",
                                        text: "DATA TRANSFERRED (MB)"
                                    }),
                                    //Space
                                    $(go.Panel, "Auto",{ margin:0, width:320, height:30}), 
                                    $(go.TextBlock, {
                                        margin: 0,
                                        alignment: go.Spot.Left,
                                        stroke: "black",
                                        text: "16",
                                        font: "3em 'Source Sans Pro',sans-serif",
                                    }),
                                    $(go.TextBlock, {
                                        margin: new go.Margin(3, 0, 0, 0),
                                        alignment: go.Spot.Left,
                                        stroke: "#031c36",
                                        font: "bold 0.8em 'Source Sans Pro',sans-serif bold",
                                        text: "COLLISIONS & ERRORS"
                                    })
                                ),
                                $(go.Panel, "Vertical",
                                    { margin: new go.Margin(10, 10, 10, 5), alignment: go.Spot.Right, width: 160,background:null},
                                    $(go.TextBlock, 
                                        {
                                            margin: 0,
                                            alignment: go.Spot.Left,
                                            stroke: "black",
                                            font: "3em 'Source Sans Pro',sans-serif",
                                            text:"100",
                                        }, 
                                        new go.Binding("text", "uptime")
                                    ),
                                    $(go.TextBlock, {
                                        margin: new go.Margin(3, 0, 0, 0),
                                        alignment: go.Spot.Left,
                                        stroke: "#031c36",
                                        font: "bold 0.8em 'Source Sans Pro',sans-serif bold",
                                        text: "UPTIME (%)"
                                    }),
                                    //Space
                                    $(go.Panel, "Auto",{ margin:0, width:320, height:30}), 
                                    $(go.TextBlock, {
                                        margin: 0,
                                        alignment: go.Spot.Left,
                                        stroke: "black",
                                        font: "3em 'Source Sans Pro',sans-serif",
                                        text:"97"
                                    }),
                                    $(go.TextBlock, {
                                        margin: new go.Margin(3, 0, 0, 0),
                                        alignment: go.Spot.Left,
                                        stroke: "#031c36",
                                        font: "bold 0.8em 'Source Sans Pro',sans-serif bold",
                                        text: "AVG LATENCY (ms)"
                                    })
                                )
                            ),
                            //Space
                            $(go.Panel, "Auto",{ margin:0, width:320, height:10})  
                        )
                    )
                //End tooltip                 
                }
            );

     // when the document is modified, add a "*" to the title and enable the "Save" button
     myDiagram.addDiagramListener("Modified", function(e) {
         var button = document.getElementById("SaveButton");
         if (button) button.disabled = !myDiagram.isModified;
         var idx = document.title.indexOf("*");

         if (myDiagram.isModified) {
             if (idx < 0) document.title += "*";
         } else {
             if (idx >= 0) document.title = document.title.substr(0, idx);
         }
     });

     myDiagram.addDiagramListener("BackgroundDoubleClicked", function(e) {
        myDiagram.commandHandler.increaseZoom();
        myDiagram.centerRect(new go.Rect(e.diagram.lastInput.documentPoint.x - 5, e.diagram.lastInput.documentPoint.y - 5, 10, 10));
     });

    //context menu for each Node
     var nodeMenu = 
         $(go.Adornment, "Vertical"

         );

     var portSize = new go.Size(7, 7);

     //context menu for each port
     var portMenu =
         $(go.Adornment, "Vertical",
             $("ContextMenuButton",
                 $(go.TextBlock, "Remove port"),
                 // in the click event handler, the obj.part is the Adornment; its adornedObject is the port
                 {
                     click: function(e, obj) {
                         removePort(obj.part.adornedObject);
                     }
                 }),
             $("ContextMenuButton",
                 $(go.TextBlock, "Change color"), {
                     click: function(e, obj) {
                         changeColor(obj.part.adornedObject);
                     }
                 }),
             $("ContextMenuButton",
                 $(go.TextBlock, "Remove side ports"), {
                     click: function(e, obj) {
                         removeAll(obj.part.adornedObject);
                     }
                 })
         );

     // the node template  and includes a panel on each side with an itemArray of panels containing ports
     myDiagram.nodeTemplate =
        $(go.Node, "Table", 
            {
                locationObjectName: "BODY",
                locationSpot: go.Spot.Center,
                selectionObjectName: "BODY",
                contextMenu: nodeMenu,
                movable: false
            },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            //The body
            $(go.Panel, "Auto", 
                {
                    row: 1,
                    column:1,
                    name: "BODY",
                    stretch: go.GraphObject.Fill
                },
                $(go.Shape, "Rectangle", {
                    margin:0,
                    fill: "white",
                    stroke: "#c4c4c4",
                    strokeWidth: 1,
                    minSize: new go.Size(205, 60),
                    maxSize: new go.Size(205, 60)
                }),
                //To display left image
                $(go.Panel, "Auto",
                    { margin:(0,0,0,1), alignment: go.Spot.Left, width: 60, height: 60, background:"#e7e7e7" },
                    $(go.Shape, "Rectangle", {margin:(0,0,0,0), stroke: "#c4c4c4",fill: "#fafafa",minSize: new go.Size(60, 60) }),
                    $(go.Picture,{ alignment: go.Spot.Left}, {margin:(7,0,0,0), width: 59, height: 58}, new go.Binding("source", "img"))
                ),
                    //To display right text
                    $(go.Panel, "Vertical",
                    // panel properties
                    { defaultStretch: go.GraphObject.Horizontal, margin: (0,0,0,70)},
                    // elements in the panel
                    $(go.TextBlock, 
                        { 
                            textAlign: "left",
                            font: "1em 'Source Sans Pro',sans-serif", 
                            stroke: "#0E3047",
                            height: 20
                        }, 
                        new go.Binding("text", "Name")
                    ),
                    $(go.TextBlock, 
                        { 
                            textAlign: "left",
                            font: "0.9em 'Source Sans Pro',sans-serif", 
                            stroke: "#9D9D9D",
                        }, 
                        new go.Binding("text", "key")
                    )
                ),
                 //To display status
                $(go.Panel, "Horizontal",{ margin:0, alignment: go.Spot.TopRight, width: 25, height: 35},
                    $(go.Picture, { width: 19, height: 19 }, 
                        new go.Binding("source", "Status", function(c) {        
                            switch (c) {
                                case "Ok":
                                    return "assets/img/LED-green@2x.png"; break;
                                case "Warning":
                                    return "assets/img/LED-yellow@2x.png"; break;
                                case "Error":
                                    return "assets/img/LED-red@2x.png"; break;
                            }
                        })
                    )                        
                )
            ), // end Auto Panel body

             // the Panel holding the left port elements, which are themselves Panels,
             // created for each item in the itemArray, bound to data.leftArray
             $(go.Panel, "Vertical",
                 new go.Binding("itemArray", "leftArray"), {
                     row: 1,
                     column: 0,
                     itemTemplate: $(go.Panel, {
                                 _side: "left", // internal property to make it easier to tell which side it's on
                                 fromSpot: go.Spot.Left,
                                 toSpot: go.Spot.Left,
                                 fromLinkable: true,
                                 toLinkable: true,
                                 cursor: "pointer",
                                 contextMenu: portMenu
                             },
                             new go.Binding("portId", "portId"),
                             $(go.Shape, "Rectangle", {
                                     stroke: null,
                                     strokeWidth: 0,
                                     fill: null,
                                     desiredSize: portSize,
                                     margin: new go.Margin(1, 0)}),
                             $(go.TextBlock, {
                                     margin: new go.Margin(0, 5, 2, 5),
                                     textAlign: "left",
                                     stroke: "black",
                                     text: "1.1",
                                     font: "0.7em 'Source Sans Pro',sans-serif"
                                 },
                                 new go.Binding("text", "portNumber"))
                         ) // end itemTemplate
                 }
             ), //end Vertical Panel

             // the Panel holding the top port elements, which are themselves Panels,
             // created for each item in the itemArray, bound to data.topArray
             $(go.Panel, "Horizontal",
                 new go.Binding("itemArray", "topArray"), {
                     row: 0,
                     column: 1,
                     itemTemplate: $(go.Panel, {
                                 _side: "left",
                                 fromSpot: go.Spot.Top,
                                 toSpot: go.Spot.Top,
                                 fromLinkable: true,
                                 toLinkable: true,
                                 cursor: "pointer",
                                 contextMenu: portMenu
                             },
                             new go.Binding("portId", "portId"),
                             $(go.Shape, "Rectangle", {
                                     stroke: null,
                                     strokeWidth: 0,
                                     fill: null,
                                     desiredSize: portSize,
                                     margin: new go.Margin(0, 1)}),
                             $(go.TextBlock, {
                                     margin: new go.Margin(5, 2, 5, 2),
                                     textAlign: "center",
                                     stroke: "black",
                                     text: "1.1",
                                     font: "0.7em 'Source Sans Pro',sans-serif"
                                 },
                                 new go.Binding("text", "portNumber"))
                         ) // end itemTemplate
                 }
             ), // end Horizontal Panel

             // the Panel holding the right port elements, which are themselves Panels,
             // created for each item in the itemArray, bound to data.rightArray
             $(go.Panel, "Vertical",
                 new go.Binding("itemArray", "rightArray"), {
                     row: 1,
                     column: 2,
                     itemTemplate: $(go.Panel, {
                                 _side: "right",
                                 fromSpot: go.Spot.Right,
                                 toSpot: go.Spot.Right,
                                 fromLinkable: true,
                                 toLinkable: true,
                                 cursor: "pointer",
                                 contextMenu: portMenu
                             },
                             new go.Binding("portId", "portId"),
                             $(go.Shape, "Rectangle", {
                                     stroke: null,
                                     strokeWidth: 0,
                                     desiredSize: portSize,
                                     fill: null,
                                     margin: new go.Margin(1, 0)}),
                             $(go.TextBlock, {
                                     margin: new go.Margin(0, 5, 2, 5),
                                     textAlign: "center",
                                     stroke: "black",
                                     text: "1.1",
                                     font: "0.7em 'Source Sans Pro',sans-serif"
                                 },
                                 new go.Binding("text", "portNumber"))
                         ) // end itemTemplate
                 }
             ), // end Vertical Panel

             // the Panel holding the bottom port elements, which are themselves Panels,
             // created for each item in the itemArray, bound to data.bottomArray
             $(go.Panel, "Horizontal",
                 new go.Binding("itemArray", "bottomArray"), {
                     row: 2,
                     column: 1,
                     itemTemplate: $(go.Panel, {
                                 _side: "bottom",
                                 fromSpot: go.Spot.Bottom,
                                 toSpot: go.Spot.Bottom,
                                 fromLinkable: true,
                                 toLinkable: true,
                                 cursor: "pointer",
                                 contextMenu: portMenu
                             },
                             new go.Binding("portId", "portId"),
                             $(go.Shape, "Rectangle", {
                                     stroke: null,
                                     strokeWidth: 0,
                                     desiredSize: portSize,
                                     fill: null,
                                     margin: new go.Margin(0, 5)}),
                            $(go.TextBlock, 
                                {
                                    margin: new go.Margin(5, 2, 5, 2),
                                    textAlign: "center",
                                    stroke: "black",
                                    text: "1.1",
                                    font: "0.7em 'Source Sans Pro',sans-serif"
                                },
                                new go.Binding("text", "portNumber"))
                        ) // end itemTemplate
                }
            ) // end Horizontal Panel
        ); // end Node

     // an orthogonal link template, reshapable and relinkable
     myDiagram.linkTemplate =
         $(CustomLink, // defined below
             {
                 routing: go.Link.AvoidsNodes,
                 corner: 4,
                 curve: go.Link.JumpGap,
                 reshapable: true,
                 resegmentable: true,
                 relinkableFrom: true,
                 relinkableTo: true,
                 selectable: false
             },
             new go.Binding("points").makeTwoWay(),
             $(go.Shape, 
                {
                     stroke: "#9C27B0",
                     strokeWidth: 2,
                     strokeDashArray: [0, 0]
                 },
                 new go.Binding("strokeDashArray", "redundant", function(d) { return d === true ? [4, 2] : [0, 0] }),
                 new go.Binding("stroke", "status", function(s) { 
                    if (s === 'warning') { return "#F6D04F"; }
                    else if (s === 'error') { return "#F64F4F"; }
                    else if (s === 'inactive') { return "#DBDBDD" }
                    else if (s === 'ok') { return "#9D9D9D"; }
                 })
             )
         );

     // load the diagram from JSON data
     load();

     // set default zoom factor
     myDiagram.commandHandler.zoomFactor = 1.5;

     // disable dragging of devices
     myDiagram.toolManager.dragSelectingTool.isEnabled = false;

 }

 // This custom-routing Link class tries to separate parallel links from each other.
 // This assumes that ports are lined up in a row/column on a side of the node.
 function CustomLink() {
      go.Link.call(this);
 };
 go.Diagram.inherit(CustomLink, go.Link);

 CustomLink.prototype.findSidePortIndexAndCount = function(node, port) {
     var nodedata = node.data;
     var portdata = port.data;
     var side = port._side;
     var arr = nodedata[side + "Array"];
     var len = arr.length;
     for (var i = 0; i < len; i++) {
         if (arr[i] === portdata) return [i, len];
     }
     return [-1, len];
 };

 /** @override */
 CustomLink.prototype.computeEndSegmentLength = function(node, port, spot, from) {
     var esl = go.Link.prototype.computeEndSegmentLength.call(this, node, port, spot, from);
     var thispt = port.getDocumentPoint(this.computeSpot(from));
     var otherpt = this.getOtherPort(port).getDocumentPoint(this.computeSpot(!from));
     if (Math.abs(thispt.x - otherpt.x) > 20 || Math.abs(thispt.y - otherpt.y) > 20) {
         var info = this.findSidePortIndexAndCount(node, port);
         var idx = info[0];
         var count = info[1];
         if (port._side == "top" || port._side == "bottom") {
             if (otherpt.x < thispt.x) {
                 return esl + 4 + idx * 8;
             } else {
                 return esl + (count - idx - 1) * 8;
             }
         } else { // left or right
             if (otherpt.y < thispt.y) {
                 return esl + 4 + idx * 8;
             } else {
                 return esl + (count - idx - 1) * 8;
             }
         }
     }
     return esl;
 };

 /** @override */
 CustomLink.prototype.hasCurviness = function() {
     if (isNaN(this.curviness)) return true;
     return go.Link.prototype.hasCurviness.call(this);
 };

 /** @override */
 CustomLink.prototype.computeCurviness = function() {
     if (isNaN(this.curviness)) {
         var fromnode = this.fromNode;
         var fromport = this.fromPort;
         var fromspot = this.computeSpot(true);
         var frompt = fromport.getDocumentPoint(fromspot);
         var tonode = this.toNode;
         var toport = this.toPort;
         var tospot = this.computeSpot(false);
         var topt = toport.getDocumentPoint(tospot);
         if (Math.abs(frompt.x - topt.x) > 20 || Math.abs(frompt.y - topt.y) > 20) {
             if ((fromspot.equals(go.Spot.Left) || fromspot.equals(go.Spot.Right)) &&
                 (tospot.equals(go.Spot.Left) || tospot.equals(go.Spot.Right))) {
                 var fromseglen = this.computeEndSegmentLength(fromnode, fromport, fromspot, true);
                 var toseglen = this.computeEndSegmentLength(tonode, toport, tospot, false);
                 var c = (fromseglen - toseglen) / 2;
                 if (frompt.x + fromseglen >= topt.x - toseglen) {
                     if (frompt.y < topt.y) return c;
                     if (frompt.y > topt.y) return -c;
                 }
             } else if ((fromspot.equals(go.Spot.Top) || fromspot.equals(go.Spot.Bottom)) &&
                 (tospot.equals(go.Spot.Top) || tospot.equals(go.Spot.Bottom))) {
                 var fromseglen = this.computeEndSegmentLength(fromnode, fromport, fromspot, true);
                 var toseglen = this.computeEndSegmentLength(tonode, toport, tospot, false);
                 var c = (fromseglen - toseglen) / 2;
                 if (frompt.x + fromseglen >= topt.x - toseglen) {
                     if (frompt.y < topt.y) return c;
                     if (frompt.y > topt.y) return -c;
                 }
             }
         }
     }
     return go.Link.prototype.computeCurviness.call(this);
 };
 // end CustomLink class

 // Add a port to the specified side of the selected nodes.
 function addPort(side) {
     myDiagram.startTransaction("addPort");
     myDiagram.selection.each(function(node) {
         // skip any selected Links
         if (!(node instanceof go.Node)) return;
         // compute the next available index number for the side
         var i = 0;
         while (node.findPort(side + i.toString()) !== node) i++;
         // now this new port name is unique within the whole Node because of the side prefix
         var name = side + i.toString();
         // get the Array of port data to be modified
         var arr = node.data[side + "Array"];
         if (arr) {
             // create a new port data object
             var newportdata = {
                 portId: name,
                 portColor: go.Brush.randomColor()
                     // if you add port data properties here, you should copy them in copyPortData above
             };
             // and add it to the Array of port data
             myDiagram.model.insertArrayItem(arr, -1, newportdata);
         }
     });
     myDiagram.commitTransaction("addPort");
 }

 // Remove the clicked port from the node.
 // Links to the port will be redrawn to the node's shape.
 function removePort(port) {
     myDiagram.startTransaction("removePort");
     var pid = port.portId;
     var arr = port.panel.itemArray;
     for (var i = 0; i < arr.length; i++) {
         if (arr[i].portId === pid) {
             myDiagram.model.removeArrayItem(arr, i);
             break;
         }
     }
     myDiagram.commitTransaction("removePort");
 }

 //Remove all ports from the same side of the node as the clicked port.
 function removeAll(port) {
     myDiagram.startTransaction("removePorts");
     var nodedata = port.part.data;
     var side = port._side; // there are four property names, all ending in "Array"
     myDiagram.model.setDataProperty(nodedata, side + "Array", []); // an empty Array
     myDiagram.commitTransaction("removePorts");
 }

 // Change the color of the clicked port.
 function changeColor(port) {
     myDiagram.startTransaction("colorPort");
     var data = port.data;
     myDiagram.model.setDataProperty(data, "portColor", go.Brush.randomColor());
     myDiagram.commitTransaction("colorPort");
 }

 //Save the model to / load it from JSON text shown on the page itself, not in a database.
 function save() {
     document.getElementById("mySavedModel").value = myDiagram.model.toJson();
     myDiagram.isModified = false;
 }

 function load() {
     myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
     myDiagram.id = "one";
 }

// Allow the user to edit text when a single node is selected
function onSelectionChanged(e) {
    var node = e.diagram.selection.first();
    if (node instanceof go.Node) {
        updateProperties(node.data);
    } else {
        updateProperties(null);
    }
}

  // Update the HTML elements of the currently selected node, if any
  function updateProperties(data) {
    if (data === null) {
      document.getElementById("col-stats").classList.remove('show-detail');
      // document.getElementById("Chassis").innerHTML = "";
      // document.getElementById("Status").innerHTML = "";
    } else if(data.Status == "Error") {
      document.getElementById("col-stats").scrollTop = 0;
      document.getElementById("col-stats").classList.add('show-detail');
      // document.getElementById("Chassis").innerHTML = data.Chassis || "";
      // document.getElementById("Status").innerHTML = '<img src="assets/img/LED-red@2x.png" width="20" height="20">' || "";
    }
    else if(data.Status == "Warning") {
      document.getElementById("col-stats").scrollTop = 0;
      document.getElementById("col-stats").classList.add('show-detail');
     // document.getElementById("Chassis").innerHTML = data.Chassis || "";
     // document.getElementById("Status").innerHTML = '<img src="assets/img/LED-yellow@2x.png" width="20" height="20">' || "";
    }
  }