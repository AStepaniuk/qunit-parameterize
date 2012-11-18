/*
 * Parameterize v 0.1
 * A QUnit Addon For Running Parameterized Tests
 * https://github.com/AStepaniuk/qunit-parameterize 
 */
QUnit.extend(QUnit, {
	cases : function(testCases) {
		var currentCases = testCases;

		var createTest = function(methodName, title, expected, callback, parameters) {
			QUnit[methodName](
				title,
				expected,
				function(assert) { return callback(parameters, assert); }
			);
		};

		var iterateTestCases = function(methodName, title, expected, callback) {
			if (!currentCases) return;

			if (!callback) {
				callback = expected;
				expected = null;
			}

			for (var i = 0; i < currentCases.length; ++i) {
				var parameters = currentCases[i];

				var testCaseTitle = title;
				if (parameters.title) {
					testCaseTitle += "[" + parameters.title + "]"; 
				}

				createTest(methodName, testCaseTitle, expected, callback, parameters);
			}
		}

		var getLength = function(arr) {
			return arr ? arr.length : 0;
		}

		var getItem = function(arr, idx) {
			return arr ? arr[idx] : undefined;
		}
		
		var mix = function(testCase, mixData) {
			if (testCase && mixData) {
				var result = clone(testCase);
				for(var p in mixData) {
					if (p !== "title") {
						if (!(p in result))  result[p] = mixData[p];
					} else {
						result[p] = [result[p], mixData[p]].join("");
					}
				}
				return result;
			} else if (testCase) {
				return testCase;
			} else if (mixData) {
				return mixData;
			} else {
				// return null or undefined whatever testCase is
				return testCase;
			}
		}

		var clone = function(testCase) {
			var result = {};
			for (var p in testCase) {
				result[p] = testCase[p];
			}
			return result;
		}

		return {
			sequential : function(addData) {
				var casesLength = getLength(currentCases);
				var addDataLength = getLength(addData);
				var length = casesLength > addDataLength ? casesLength : addDataLength;

				var newCases = [];
				for (var i = 0; i < length; ++i) {
					var currentCaseI = getItem(currentCases, i);
					var dataI = getItem(addData, i);
					var newCase = mix(currentCaseI, dataI);

					if (newCase) newCases.push(newCase);
				}
				currentCases = newCases;

				return this;
			},

			test : function(title, expected, callback) {
				iterateTestCases("test", title, expected, callback);
			},

			asyncTest : function(title, expected, callback) {
				iterateTestCases("asyncTest", title, expected, callback);
			}
		}
	}
});
