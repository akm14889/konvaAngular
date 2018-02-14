//basic variables to start with
var width = window.innerWidth;
var height = window.innerHeight;

var stage = new Konva.Stage({
	container: 'container',
	width: width,
	height: height
});

var layer = new Konva.Layer();

//build the layout

var rect1 = new Konva.Rect({
	x: 10,
	y: 10,
	width: width - 40,
	height: 40,
	stroke: 'black',
	strokeWidth: 1,
	fill : '#e4dcf3'
});

var rect2 = new Konva.Rect({
	x: 15,
	y: 15,
	width: 100,
	height: 30,
	stroke: 'black',
	strokeWidth: 1,
	fill : '#daeffa'
});

layer.add(rect1);
layer.add(rect2);
//layer.add(rect4);
var text1 = new Konva.Text({
	x: 16,
	y: 22,
	fontFamily: 'Calibri',
	fontSize: 14,
	fill: 'black'
});

layer.add(text1);
//Event handler for clicks in a section..
//TODO:
//1. need to remember inputted values and populate on return. angular should take care of this.
//2. Here is where the code should read persistent data of cards,  relevant template
//and "create" a htmlstring and set innerHTML to display

rect2.on('mousedown touchstart', function(oEvent) {
	// writeMessage('Mousedown or touchstart');
	var oKonvaText =  getKonvaTextTarget(oEvent.currentTarget);
	if (oKonvaText.getText()) {
		var scope = angular.element(document.getElementById("rect2")).scope();
		scope.$apply(function() {
			var sName = "";
			var sCity = "";
			if (oKonvaText.getText().split('--').length > 1) {
				sName = oKonvaText.getText().split('--')[0];
				sCity = oKonvaText.getText().split('--')[1];
				scope.name = sName;
				scope.selectedCity = sCity;
			}
		});
	}
	document.getElementById('rect2').style.visibility='visible';
	document.getElementById('rect2').konvaTarget = oEvent.currentTarget;
});

function getKonvaTextTarget(oTargetRectangle) {
	var oKonvaTextToModify = {};
	for(var idx = 1; idx <layer.getChildren().length; idx++) {
		if(layer.getChildren()[idx] == oTargetRectangle) {
			oKonvaTextToModify = layer.getChildren()[idx+1];
			break;
	    }
	}
	return oKonvaTextToModify;
}
stage.add(layer);