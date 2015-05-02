angular.module('myApp', []).controller('buttonCtrl', function($scope, $http) {
	var divisionSign = "\u00F7";
	var multipleSign = "\u00D7";

    $scope.expression = '';
    $scope.expressionResult = '';
    $scope.numberOfSymbol = 0;
    
	$scope.leftButtons = [
		['7', '8', '9'],
		['4', '5', '6'],
		['1', '2', '3'],
		['.', '0', '=']
	];
	
	$scope.rightButtons = ['C', 'CE', divisionSign, multipleSign, '-', '+'];
	
	$scope.calculate = function() {
		var expression = $scope.expression.replace(divisionSign, '/').replace(multipleSign, '*');
		
		try {
			$scope.expressionResult = eval(expression).toString();
		} catch (e) {
			console.log(e.message);	
		}
	}
	
	var isAlpha = function(c) {
		if (c.search(/[^A-Za-z\s]/) != -1) {
			return false;	
		}
		return true;
	}
	$scope.post = function(c) {
		var token = $('meta[name="csrf-token"]').attr('content');

		$http.defaults.headers.post = {
			'X-CSRF-Token': token,
			'Content-Type': 'application/json'
		};
		$http.post("/calculator", {"input": c}).success(function(response) {
			console.log('[' + response + ']');
		});
	}

	$scope.clearAll = function() {
		$scope.expression = '';
		$scope.expressionResult = '';
		$scope.numberOfSymbol = 0;	
	}
	
	$scope.pressRightButton = function(s) {
		console.log('input ' + s);
		$scope.post(s);

		switch (s) {
			case 'C':
				$scope.clearAll();
					
				break;
			case 'CE':
				if (0 < $scope.expression.length) {
					var lastChar = $scope.expression.slice(-1);
					
					console.log('last char: ' + lastChar);
					
					if (isAlpha(lastChar)) {
						$scope.clearAll();
					} else {
					
						if (isNaN(lastChar) && lastChar !== '.') {
							$scope.numberOfSymbol -= 1;
							console.log('symbol: ' + $scope.numberOfSymbol);
						}
					
						$scope.expression = $scope.expression.substring(0, $scope.expression.length - 1);
					
						if ($scope.numberOfSymbol > 0) {
							$scope.calculate();
						} else {
							$scope.expressionResult = '';
						}
					}
				}
				break;
			default: /* operators */
				if (0 < $scope.expression.length) {
					var lastChar = $scope.expression.slice(-1);
					
					if (isNaN(lastChar) && lastChar !== '.' && !isAlpha(lastChar)) {
						$scope.expression = $scope.expression.substring(0, $scope.expression.length - 1);
						$scope.expression += s;
					} else {
						$scope.expression += s;
						$scope.numberOfSymbol += 1;
					}
					console.log('symbol: ' + $scope.numberOfSymbol);
				}
				break;
		}
		
	}
	
	$scope.pressLeftButton = function(s) {
		console.log('input ' + s);
		$scope.post(s);

		switch (s) {
			case '=':
				$scope.calculate();
				$scope.expression = $scope.expressionResult;
				if (null == $scope.expression) {
					$scope.expression = '';
					console.log('expresion is null');
				}
				$scope.expressionResult = '';
				$scope.numberOfSymbol = 0;
				break;
			case '.':
				break;
			case '0':
				if (0 === $scope.expression.length) {
					return;	
				}
			default: /* numbers */
				var lastChar = $scope.expression.slice(-1);
				
				if ('0' === lastChar) {
					var lastLastChar = $scope.expression.slice(-2, -1);
					
					if (isNaN(lastLastChar)) {
						$scope.expression = $scope.expression.substring(0, $scope.expression.length - 1);
					}
				}
			
			
				$scope.expression += s;
				if ($scope.numberOfSymbol > 0) {
					try {
						$scope.calculate();
					} catch (e) {
						console.log(e.message);	
					}
				}
				break;
		}
	}
});
