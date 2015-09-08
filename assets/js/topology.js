function init() {
     if (window.goSamples) goSamples(); // init for these samples -- you don't need to call this
     var $ = go.GraphObject.make; //for conciseness in defining node templates

     myDiagram =
         $(go.Diagram, "myDiagram", //Diagram refers to its DIV HTML element by id
             {
                 initialContentAlignment: go.Spot.Center,
                 "undoManager.isEnabled": true
             });

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
         $(go.Node, "Table", {
                 locationObjectName: "BODY",
                 locationSpot: go.Spot.Center,
                 selectionObjectName: "BODY",
                 contextMenu: nodeMenu
             },

             new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),

             //The body
             $(go.Panel, "Auto", {
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
                     minSize: new go.Size(250, 60)
                 }),
				 
                 //To display left image
                 $(go.Panel, "Auto",{ margin:(0,0,0,1), alignment: go.Spot.Left, width: 80, height: 58, background:"#e7e7e7" },
			     $(go.Shape, "Rectangle", {margin:(0,0,0,0), stroke: "#c4c4c4",fill: "#fafafa",minSize: new go.Size(60, 58) }),							  
	             $(go.Picture,{ alignment: go.Spot.Left}, {margin:(7,0,0,20), width: 40, height: 25},
				   new go.Binding("source", "img"))		  
                 ) ,

				//To display right text
				$(go.Panel, "Vertical",{ margin:0, alignment: go.Spot.Right, width: 168, height: 35},
				$(go.TextBlock,{ alignment: go.Spot.Top}, { margin: (12,0,0,0),font: "14px  Segoe UI,sans-serif",stroke: "black"}, new go.Binding("text", "key")),
				$(go.TextBlock,{ alignment: go.Spot.Bottom}, { margin: (12,0,0,0),font: "14px  Segoe UI,sans-serif",stroke: "#0d4774"}, new go.Binding("text", "Chassis"))	  
				) ,
				
                 //To display status
                $(go.Panel, "Horizontal",{ margin:0, alignment:
                go.Spot.TopRight, width: 30, height: 30},
                 $(go.Picture, { width: 25, height: 23 }, new
                 go.Binding("source", "Status", function(c) {        
                            switch (c) {
                                case "Ok":
                                    return "assets/img/LED-green@2x.png"; break;
   
                                case "Warning":
                                    return "assets/img/icon-now-blue@2x.png"; break;
   
                                case "Error":
                                    return "assets/img/icon-now-red@2x.png"; break;
  
                                  }
                                }))                        
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
                                     margin: new go.Margin(0, 5, 0, 5),
                                     textAlign: "left",
                                     stroke: "black",
                                     text: "1.1",
                                     font: "12px  Segoe UI,sans-serif"
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
                                     margin: new go.Margin(5, 0, 0, 0),
                                     textAlign: "center",
                                     stroke: "black",
                                     text: "1.1",
                                     font: "12px  Segoe UI,sans-serif"
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
                                     margin: new go.Margin(0, 5, 0, 5),
                                     textAlign: "center",
                                     stroke: "black",
                                     text: "1.1",
                                     font: "12px  Segoe UI,sans-serif"
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
                             $(go.TextBlock, {
                                     margin: new go.Margin(5, 0, 5, 0),
                                     textAlign: "center",
                                     stroke: "black",
                                     text: "1.1",
                                     font: "12px  Segoe UI,sans-serif"
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
                 relinkableTo: true
             },
             new go.Binding("points").makeTwoWay(),
             $(go.Shape, {
                 strokeWidth: 2
             },
             new go.Binding("stroke", "linkColor"))
         );

     // load the diagram from JSON data
     load();
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

 diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

 //Save the model to / load it from JSON text shown on the page itself, not in a database.
 function save() {
     document.getElementById("mySavedModel").value = myDiagram.model.toJson();
     myDiagram.isModified = false;
 }

 function load() {
     myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
     myDiagram.id = "one";
 }
