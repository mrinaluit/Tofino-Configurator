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
                 contextMenu: nodeMenu,
                 selectable: false
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
                     minSize: new go.Size(205, 60),
                     maxSize: new go.Size(205, 60)
                 }),
				 
                 //To display left image
                 $(go.Panel, "Auto",{ margin:(0,0,0,1), alignment: go.Spot.Left, width: 60, height: 60, background:"#e7e7e7" },
			     $(go.Shape, "Rectangle", {margin:(0,0,0,0), stroke: "#c4c4c4",fill: "#fafafa",minSize: new go.Size(60, 60) }),							  
	             $(go.Picture,{ alignment: go.Spot.Left}, {margin:(7,0,0,0), width: 59, height: 58},
				   new go.Binding("source", "img"))		  
                 ) ,

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
                        new go.Binding("text", "Chassis")
                    ),
                    $(go.TextBlock, 
                        { 
                            textAlign: "left",
                            font: "0.9em 'Source Sans Pro',sans-serif", 
                            stroke: "#9D9D9D",
                        }, 
                        new go.Binding("text", "key")
                    )
				) ,
				
                 //To display status
                $(go.Panel, "Horizontal",{ margin:0, alignment:
                go.Spot.TopRight, width: 25, height: 35},
                 $(go.Picture, { width: 19, height: 19 }, new
                 go.Binding("source", "Status", function(c) {        
                            switch (c) {
                                case "Ok":
                                    return "assets/img/LED-green@2x.png"; break;
   
                                case "Warning":
                                    return "assets/img/LED-yellow@2x.png"; break;
   
                                case "Error":
                                    return "assets/img/LED-red@2x.png"; break;
                                  }
                                }))                        
                ),
				
				
				
				 //To display Tooltip 
                 {
                     toolTip: $(go.Adornment, "Auto",{ background: "white",     mouseOver: function (e, obj) { showPoint(obj.part.location); }},
                              
							  $(go.Shape, {margin: 1,stroke: "#d3d8db",fill: "white", width: 320}),
							  

                              //$(go.RowColumnDefinition,{ column: 1, sizing: go.RowColumnDefinition.None }),


                              $(go.Panel, "Vertical", {
                                     width: 320,
                                     defaultStretch: go.GraphObject.Horizontal
                                 },
								 
								 
								
							$(go.Panel, "Auto",{ margin:0, width:320, height: 30},
							 $(go.Shape, {
                                 margin: 1,
								 stroke:null,
								 fill: "#fafafa" //"#f2f0f0"
								 
                             }),$(go.TextBlock, {
                                     margin: 4,
                                     alignment: go.Spot.Center,
                                     stroke: "#031c36",
                                     font: "bold 15px 'Source Sans Pro',sans-serif"
                                 }, new go.Binding("text", "Chassis"))),
							
							    //bottom Border
								$(go.Panel, "Auto",{ margin:0, width:320, height:0.5,background:"#cdcdce"}),
								
	                           //Top Space
	                            $(go.Panel, "Auto",{ margin:0, width:320, height:10}),
	
                                 $(go.TextBlock, {
                                     margin: 4,
                                     textAlign: "left",
                                     stroke: "#031c36",
                                     font: "bold 11px 'Source Sans Pro',sans-serif",
									 text: "STATS"
                                 }),

                                 //bottom Border
								$(go.Panel, "Auto",{ margin:0, width:320, height:0.5,background:"#cdcdce"}),
								 
							
							  //Space
	                          $(go.Panel, "Auto",{ margin:0, width:320, height:10}), 
								 
							  //Information content 
							  $(go.Panel, "Horizontal",{ margin:0, width:320},

							  $(go.Panel, "Vertical",{ margin:5, alignment: go.Spot.Left, width: 150,background:null},

								$(go.TextBlock, {
                                     margin: 2,
                                     alignment: go.Spot.Left,
                                     stroke: "black",
                                     text: "On",
                                     font: "18px 'Source Sans Pro',sans-serif"
                                 }, new go.Binding("text", "AutoNeg")),
								
								
								 $(go.TextBlock, {
                                     margin: 2,
                                     alignment: go.Spot.Left,
                                     stroke: "#031c36",
                                     font: "bold 10px 'Source Sans Pro',sans-serif",
									 text: "AUTO NEG"
                                 }),
								 
								//Space
	                            $(go.Panel, "Auto",{ margin:0, width:320, height:10}), 
								 
								 $(go.TextBlock, {
                                     margin: 2,
                                     alignment: go.Spot.Left,
                                     stroke: "black",
                                     text: "28C",
                                     font: "18px 'Source Sans Pro',sans-serif"
                                 }, new go.Binding("text", "Temperature")),
								 
								  $(go.TextBlock, {
                                     margin: 2,
                                     alignment: go.Spot.Left,
                                     stroke: "#031c36",
                                     font: "bold 10px 'Source Sans Pro',sans-serif",
									 text: "TEMPERATURE"
                                 }),
								  
								  
								  //Space
	                            $(go.Panel, "Auto",{ margin:0, width:320, height:10}), 
								  
								  $(go.TextBlock, {
                                     margin: 2,
                                     alignment: go.Spot.Left,
                                     stroke: "black",
                                     text: "Hirschmann",
                                     font: "18px 'Source Sans Pro',sans-serif"
                                 }, new go.Binding("text", "Location")),
								  
								   $(go.TextBlock, {
                                     margin: 2,
                                     alignment: go.Spot.Left,
                                     stroke: "#031c36",
                                     font: "bold 10px 'Source Sans Pro',sans-serif bold",
									 text: "LOCATION"
                                 }),
								   
								   
								   //Space
	                               $(go.Panel, "Auto",{ margin:0, width:320, height:10}), 
								   
								    $(go.TextBlock, {
                                     margin: 2,
                                     alignment: go.Spot.Left,
                                     stroke: "black",
                                     text: "Reachable",
                                     font: "18px 'Source Sans Pro',sans-serif"
                                 }, new go.Binding("text", "Reachability")),
								  
								   $(go.TextBlock, {
                                     margin: 2,
                                     alignment: go.Spot.Left,
                                     stroke: "#031c36",
                                     font: "bold 10px 'Source Sans Pro',sans-serif bold",
									 text: "REACHABILITY"
                                 })
   
								 
								),
							  
							  $(go.Panel, "Vertical",{ margin:0, alignment: go.Spot.TopRight, width: 160,background:null},
								
						        $(go.TextBlock, {
                                     margin: 2,
                                     alignment: go.Spot.Left,
                                     stroke: "black",
                                     text: "2 Users",
                                     font: "18px 'Source Sans Pro',sans-serif"
                                 }, new go.Binding("text", "NoOfUsers")),
								
								
								 $(go.TextBlock, {
                                     margin: 2,
                                     alignment: go.Spot.Left,
                                     stroke: "#031c36",
                                     font: "bold 10px 'Source Sans Pro',sans-serif bold",
									 text: "NO OF USERS"
                                 }),
								 
								 
								 //Space
	                            $(go.Panel, "Auto",{ margin:0, width:320, height:10}), 
								 
								 
								 $(go.TextBlock, {
                                     margin: 2,
                                     alignment: go.Spot.Left,
                                     stroke: "black",
                                     font: "18px 'Source Sans Pro',sans-serif"
                                 }, new go.Binding("text", "Product")),
								 
								  $(go.TextBlock, {
                                     margin: 2,
                                     alignment: go.Spot.Left,
                                     stroke: "#031c36",
                                     font: "bold 10px 'Source Sans Pro',sans-serif bold",
									 text: "PRODUCT"
                                 }),
								  
								  
								  //Space
	                              $(go.Panel, "Auto",{ margin:0, width:320, height:10}), 
								  
								  $(go.TextBlock, {
                                     margin: 2,
                                     alignment: go.Spot.Left,
                                     stroke: "black",
                                     font: "18px 'Source Sans Pro',sans-serif"
                                 }, new go.Binding("text", "FirmwareVersion")),
								  
								   $(go.TextBlock, {
                                     margin: 2,
                                     alignment: go.Spot.Left,
                                     stroke: "#031c36",
                                     font: "bold 10px 'Source Sans Pro',sans-serif bold",
									 text: "FIRMWARE VERSION"
                                 })
								  
								)
							  
							  ),
								 
								 
								//Space
	                            $(go.Panel, "Auto",{ margin:0, width:320, height:10})  
								 
								

                             )

                         ) // end of Adornment

                 }
                 //Tooltip End
				
				
				
				
				
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
             ) // end Horizontal Panel
         ); // end Node

     // an orthogonal link template, reshapable and relinkable
     myDiagram.linkTemplate =
         $(CustomLink, // defined below
             {
                 routing: go.Link.AvoidsNodes,
                 corner: 4,
                 curve: go.Link.JumpGap,
                 reshapable: false,
                 resegmentable: false,
                 relinkableFrom: false,
                 relinkableTo: false,
                 selectable: false
             },
             new go.Binding("points").makeTwoWay(),
             $(go.Shape, 
                {
                    stroke: "#9D9D9D",
                    strokeWidth: 2,
                    strokeDashArray: [0, 0]
                },
                new go.Binding("stroke", "linkColor"),
                new go.Binding("strokeDashArray", "redundant", function(d) { return d === true ? [5, 10] : [0, 0] }),
                new go.Binding("stroke", "status", function(s) { 
                    if (s === 'warning') { return "#F6D04F"; }
                    else if (s === 'error') { return "#F64F4F"; }
                    else if (s === 'inactive') { return "#DBDBDD" }
                    else { return "#9D9D9D"; }
                })
            )
    );

     // load the diagram from JSON data
     load();

     // set default zoom factor
     myDiagram.commandHandler.zoomFactor = 1.5;

     // disable dragging of devices
     myDiagram.toolManager.dragSelectingTool.isEnabled = false

     // zoom topology to fit on load
     myDiagram.commandHandler.zoomToFit();

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


  
  //Enable/disable zoom effects
  function enable(name, ok) {
    var button = document.getElementById(name);
    if (button) button.disabled = !ok;
  }
  // enable or disable all command buttons
  function enableAll() {
    var cmdhnd = diagram.commandHandler;
	enable("ZoomIn", cmdhnd.canIncreaseZoom());
	enable("ZoomOut", cmdhnd.canDecreaseZoom());
  }
  // notice whenever the selection may have changed
  diagram.addDiagramListener("ChangedSelection", function(e) {
    enableAll();
  });
  // notice when the Paste command may need to be reenabled
  diagram.addDiagramListener("ClipboardChanged", function(e) {
    enableAll();
  });
  // notice whenever a transaction or undo/redo has occurred
  diagram.model.addChangedListener(function(e) {
    if (e.isTransactionFinished) enableAll();
  });
  // perform initial enablements after everything has settled down
  setTimeout(enableAll, 1);

  myDiagram = diagram;  // make the diagram accessible to button onclick handlers
