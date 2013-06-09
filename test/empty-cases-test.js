(function(){
	QUnit.module("Empty test cases validation");
	
	var emptyTestCases = [
		{
			title : "null cases",
			cases : null
		},
		{
			title : "undefined cases",
			cases : undefined
		},
		{
			title : "empty array",
			cases : []
		}
	];

	var registerTestForFailing = function(testCase) {
		QUnit.test(testCase.title, function(assert){
			var record = recordCalls(QUnit, "test", function() {
				QUnit
					.cases(testCase.cases)
					// setup fake test
					.test("", function(){ });
			});

			// get the actual test callback passed
			var testCallback = record.getArguments()[0][1];

			// validate that actual callback failes test via assert.ok(false);
			var fakeAssert = {};
			var recordAssert = recordCalls(fakeAssert, "ok", function() {
				testCallback(fakeAssert);
			});
			
			var actualResult = recordAssert.getArguments()[0][0];
			assert.strictEqual(actualResult, false);
		});
	}

	for (var i = 0; i < emptyTestCases.length; ++i) {
		var testCase = emptyTestCases[i];
		registerTestForFailing(testCase);
	}

	QUnit.test("Message check", function(assert){
		var record = recordCalls(QUnit, "test", function() {
			QUnit
				.cases([])
				// setup fake test
				.test("", function(){ });
		});

		// get the actual test callback passed
		var testCallback = record.getArguments()[0][1];

		// validate that actual callback failes test via assert.ok(false);
		var fakeAssert = {};
		var recordAssert = recordCalls(fakeAssert, "ok", function() {
			testCallback(fakeAssert);
		});

		var actualMessage = recordAssert.getArguments()[0][1];
		assert.equal(actualMessage, "No test cases are provided");
	});
})();