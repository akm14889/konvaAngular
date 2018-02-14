//controller for rect1
var helloApp = angular.module("HelloApp", []);
helloApp.controller('Hello2', function($scope,$compile) {

	/**
	 * HTML string which renders the form
	 */
	var sNishuForm = '<span>My name is </span> \
		<input type="text" ng-model="name" \
		placeholder="Enter Name" class="txtstyle"> <br> <br> \
		I live in &nbsp&nbsp <select ng-model="selectedCity" \
		ng-disabled="name.length < 1" ng-options="city for city in cities" \
		ng-change="cityValid()"></select> <br> \
		<hr> \
		<input type="button" value="Add" \
		ng-disabled="cityInvalid|| name.length < 1" \
		ng-click="renderMessage()" /> &nbsp&nbsp \
		<input type="button" value="Close" ng-click="clearMessage()" />';


	var temp = $compile(sNishuForm)($scope);
	angular.element(document.getElementById('rect2')).append(temp);

	/**
	 *temporary code restructure and split across files
	 **/

	$scope.name = "";

	$scope.selectedCity = "Select City";
	$scope.cities = [ 'Select City', 'Jammu', 'Delhi', 'Chennai', 'Bangalore'];
	$scope.cityInvalid = true;

	$scope.renderMessage = function() {
		document.getElementById('rect2').style.visibility='hidden';
		this.adjustKonva();
	}
	/**
	 * constants for row and column for konva rendering
	 */
	var MAX_RECTANGLE_IN_ROW = Math.floor(screen.width/115);
	var MAX_RECTABGLE_IN_COLUMN = Math.floor(screen.height/35);

	/**
	 * driver function which  re-renders the konva layer and
	 * adds new block based on screen size and calculation
	 */
	$scope.adjustKonva = function() {
		var xyOffSetForRect = this.getXYOffsetForRectangle(layer.getChildren());
		this.addKonvaBlocksToLayer(xyOffSetForRect);
	}

	/**
	 * calculates the coordinate for new rectangle and text
	 * and return {{
	 * 	X : "xoffset",
	 * 	Y : "yoffset",
	 * 	row : "currentRow#"
	 * }}
	 */

	$scope.getXYOffsetForRectangle = function(layerChildrens) {
		var xyObject = {};
		var currentRow = Math.floor(((layerChildrens.length - 1 )/2) / MAX_RECTANGLE_IN_ROW);
		var nCountOfRectagleInCurrentRow = ((layerChildrens.length - 1 )/2) % MAX_RECTANGLE_IN_ROW;
		if (nCountOfRectagleInCurrentRow < MAX_RECTANGLE_IN_ROW) {
			xyObject.X = (nCountOfRectagleInCurrentRow ) * 100 + (nCountOfRectagleInCurrentRow + 1) * 15;
		}
		else {
			xyObject.X = 15;
		}
		xyObject.Y = (currentRow) * 30 + (currentRow + 1) * 15;
		xyObject.row = currentRow;
		return xyObject;
	}

	/**
	 * actual function which adds new konva rect and text
	 * adds event to konva rect to open angular form
	 * sets the text to the rect which is clicked.
	 */
	$scope.addKonvaBlocksToLayer = function(xyObject) {

		if(this.bAddNewBlock()) {
			var rect = new Konva.Rect({
				x: xyObject.X,
				y: xyObject.Y,
				width: 100,
				height: 30,
				stroke: 'black',
				strokeWidth: 1,
				fill : '#daeffa'
			});

			var text = new Konva.Text({
				x: xyObject.X + 1,
				y: xyObject.Y + 7,
				fontFamily: 'Calibri',
				fontSize: 14,
				fill: 'black'
			});
			rect.on('mousedown touchstart', function(oEvent) {
				var konvaTextToGetTextFrom = $scope.getKonvaTextTarget(oEvent.currentTarget);
				var sText = konvaTextToGetTextFrom.getText();
				var sName = "";
				var sCity = "";
				if (sText.split('--').length > 1) {
					sName = sText.split('--')[0];
					sCity = sText.split('--')[1];
				}
				var scope = angular.element(document.getElementById("rect2")).scope();
				scope.$apply(function() {
					if (sName && sCity) {
						scope.name = sName;
						scope.selectedCity = sCity;
					}
				});
				document.getElementById('rect2').style.visibility='visible';
				document.getElementById('rect2').konvaTarget = oEvent.currentTarget;
			});
			layer.add(rect);
			layer.add(text);
			rect1.setHeight((xyObject.row + 1) * 45);
		}
		var konvaTextToModify = this.getKonvaTextTarget(document.getElementById('rect2').konvaTarget);
		konvaTextToModify.setText($scope.name + "--" + $scope.selectedCity)
		layer.draw();
	}

	$scope.getKonvaTextTarget = function(oTargetRectangle) {
		var oKonvaTextToModify = {};
		for(var idx = 1; idx <layer.getChildren().length; idx++) {
			if(layer.getChildren()[idx] == oTargetRectangle) {
				oKonvaTextToModify = layer.getChildren()[idx+1];
				break;
			}
		}
		return oKonvaTextToModify;
	}

	$scope.bAddNewBlock = function() {
		var oTargetRect = document.getElementById('rect2').konvaTarget;
		var aAllElements = layer.getChildren();
		return (aAllElements.length -2 === aAllElements.indexOf(oTargetRect));
	}

	/**
	 * not needed for now
	 */
	$scope.clearMessage = function() {
		document.getElementById('rect2').style.visibility='hidden';
	}


	$scope.cityValid = function() {
		$scope.cityInvalid = false;
		$scope.cities = [ 'Jammu', 'Delhi', 'Chennai', 'Bangalore' ];
	}
});