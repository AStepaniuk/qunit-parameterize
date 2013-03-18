/*
 * Parameterize v 0.1
 * A QUnit Addon For Running Parameterized Tests
 * https://github.com/AStepaniuk/qunit-parameterize 
 */
QUnit.extend(QUnit, {
	cases : function(testCases) {
		var createTest = function(methodName, title, expected, callback, parameters) {
			QUnit[methodName](
				title,
				expected,
				function(assert) { return callback.call(this, parameters, assert); }
			);
		};

		var iterateTestCases = function(methodName, title, expected, callback) {
			if (!testCases) return;

			if (!callback) {
				callback = expected;
				expected = null;
			}

			for (var i = 0; i < testCases.length; ++i) {
				var parameters = testCases[i];

				var testCaseTitle = title;
				if (parameters.title) {
					testCaseTitle += "[" + parameters.title + "]"; 
				}

				createTest(methodName, testCaseTitle, expected, callback, parameters);
			}
		}

		return {
			test : function(title, expected, callback) {
				iterateTestCases("test", title, expected, callback);
                return this;
			},

			asyncTest : function(title, expected, callback) {
				iterateTestCases("asyncTest", title, expected, callback);
                return this;
			}
		}
	}
});
