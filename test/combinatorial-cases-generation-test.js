(function(){
	QUnit.module("Combinatorial tests generation");
	
	var combinatorialTestCases = [
		{
			title : "1x1",
			originalCases : [{ a : 1 }],
			mixData : [{ b : "val_b" }],
			expectedCases : [{ a : 1, b : "val_b" }]
		},
		{
			title : "2x2",
			originalCases : [{ a : 1 }, { a : 2 }],
			mixData : [{ b : "v1" }, { b : "v2" }],
			expectedCases : [{ a : 1, b : "v1" }, { a : 1, b : "v2" }, { a : 2, b : "v1" }, { a : 2, b : "v2" }]
		},
		{
			title : "1x3",
			originalCases : [{ a : 1 }],
			mixData : [{ b : "v1" }, { b : "v2" }, { b : "v3" }],
			expectedCases : [{ a : 1, b : "v1" }, { a : 1, b : "v2" }, { a : 1, b : "v3" }]
		},
		{
			title : "3x1",
			originalCases : [{ a : 1 }, { a : 2 }, { a : 3 }],
			mixData : [{ b : "v1" }],
			expectedCases : [{ a : 1, b : "v1" }, { a : 2, b : "v1" }, { a : 3, b : "v1" }]
		},
		{
			title : "0x3",
			originalCases : [],
			mixData : [{ b : "v1" }, { b : "v2" }, { b : "v3" }],
			expectedCases : [{ b : "v1" }, { b : "v2" }, { b : "v3" }]
		},
		{
			title : "3x0",
			originalCases : [{ a : 1 }, { a : 2 }, { a : 3 }],
			mixData : [],
			expectedCases : [{ a : 1 }, { a : 2 }, { a : 3 }]
		},
		{
			title : "undefined-cases considering",
			originalCases : [{ a : 1 }, undefined],
			mixData : [undefined, { b : "v2" }],
			expectedCases : [{ a : 1 }, { a : 1, b : "v2" }, { b : "v2" }]
		},
		{
			title : "null-cases considering",
			originalCases : [null, { a : 2 }],
			mixData : [{ b : "v1" }, null],
			expectedCases : [{ b : "v1" }, { a : 2, b : "v1" }, { a : 2 }]
		},
		{
			title : "undefined x 1",
			originalCases : undefined,
			mixData : [{ b : "v1" }],
			expectedCases : [{ b : "v1" }]
		},
		{
			title : "null x 1",
			originalCases : null,
			mixData : [{ b : "v1" }],
			expectedCases : [{ b : "v1" }]
		},
		{
			title : "1 x undefined",
			originalCases : [{ a : 1 }],
			mixData : undefined,
			expectedCases : [{ a : 1 }]
		},
		{
			title : "1 x null",
			originalCases : [{ a : 1 }],
			mixData : null,
			expectedCases : [{ a : 1 }]
		},
		{
			title : "[{}, undefined] x undefined",
			originalCases : [{ a : 1 }, undefined],
			mixData : undefined,
			expectedCases : [{ a : 1 }]
		},
		{
			title : "undefined x [undefined, {}]",
			originalCases : undefined,
			mixData : [undefined, { b : "v2" }],
			expectedCases : [{ b : "v2" }]
		},
		{
			title : "[null, {}] x null",
			originalCases : [null, { a : 2 }],
			mixData : null,
			expectedCases : [{ a : 2 }]
		},
		{
			title : "null x [{}, null]",
			originalCases : null,
			mixData : [{ b : "v1" }, null],
			expectedCases : [{ b : "v1" }]
		},
		{
			title : "Param name conflicts",
			originalCases : [{ a : 1 }, { a : undefined }, { a : null }, { } ],
			mixData : [{ a : 10 }, { a : undefined }, { a : null }, { } ],
			expectedCases : [
				{ a : 1 }, { a : 1 }, { a : 1 }, { a : 1 },
				{ a : undefined }, { a : undefined }, { a : undefined }, { a : undefined },
				{ a : null }, { a : null }, { a : null }, { a : null },
				{ a : 10 }, { a : undefined }, { a : null }, { }
			]
		},
		{
			title : "title concatenation",
			originalCases : [{ title : "t1", a : 1 }, { a : 2 }],
			mixData : [{ title : "d1", b : "v1" }, { b : "v2" }],
			expectedCases : [
				{ title : "t1d1", a : 1, b : "v1" }, { title : "t1", a : 1, b : "v2" },
				{title : "d1",  a : 2, b : "v1" }, { a : 2, b : "v2" }
			]
		}
	];

	var registerTest = function(testCase) {
		QUnit.test(testCase.title, function(assert){
			var actualTestCases = [];

			var record = recordCalls(QUnit, "test", function() {
				QUnit
					.cases(testCase.originalCases)
					.combinatorial(testCase.mixData)
					.test("", function(actualTestCase){
						// Test callback saves passed actualTestCase object.
						actualTestCases.push(actualTestCase)
					});
			});

			var recordedArguments = record.getArguments();
			for(var i = 0; i < recordedArguments.length; ++i) {
				// execute test callback which is passed as 3-rd argument
				recordedArguments[i][2]();
			}
			assert.deepEqual(actualTestCases, testCase.expectedCases);
		});
	}
	
	for (var i = 0; i < combinatorialTestCases.length; ++i) {
		var testCase = combinatorialTestCases[i];
		registerTest(testCase);
	}


	QUnit.test("Do not change original test cases objects", function(assert){
		var originalCases = [{ a : 1 }, { a : 2 }];
		var addData = [{ b : "v1" }, { b : "v2" }];
		var actualTestCases = [];

		var record = recordCalls(QUnit, "test", function() {
			QUnit
				.cases(originalCases)
				.combinatorial(addData)
				.test("", function(actualTestCase){});
		});

		assert.deepEqual(originalCases, [{ a : 1 }, { a : 2 }]);
	});


	QUnit.test("Fluent calls support", function(assert){
		var originalCases = [{ a : 1 }, { a : 2 }];
		var addData1 = [{ b : "v" }];
		var addData2 = [{ c : ["arr"] }];
		var addData3 = [{ d : { p : "p"} }];
		var actualTestCases = [];

		var record = recordCalls(QUnit, "test", function() {
			QUnit
				.cases(originalCases)
				.combinatorial(addData1)
				.combinatorial(addData2)
				.combinatorial(addData3)
				.test("", function(actualTestCase){
					// Test callback saves passed actualTestCase object.
					actualTestCases.push(actualTestCase)
				});
		});

		var recordedArguments = record.getArguments();
		for(var i = 0; i < recordedArguments.length; ++i) {
			// execute test callback which is passed as 3-rd argument
			recordedArguments[i][2]();
		}

		assert.deepEqual(
			actualTestCases,
			[
				{ a : 1, b : "v", c : ["arr"], d : { p : "p"} },
				{ a : 2, b : "v", c : ["arr"], d : { p : "p"} }
			]
		);
	});
})();