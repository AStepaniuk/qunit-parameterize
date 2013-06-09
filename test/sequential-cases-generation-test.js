(function(){
	QUnit.module("Sequential tests generation");
	
	var sequentialTestCases = [
		{
			title : "1x1, properties addition",
			originalCases : [{ a : 1 }],
			addData : [{ b : "val_b" }],
			expectedCases : [{ a : 1, b : "val_b" }]
		},
		{
			title : "3x3, properties addition",
			originalCases : [{ a : 1 }, { a : 2 }, { a : 3 }],
			addData : [{ b : "v1" }, { b : "v2" }, { b : "v3" }],
			expectedCases : [{ a : 1, b : "v1" }, { a : 2, b : "v2" }, { a : 3, b : "v3" }]
		},
		{
			title : "1x3, properties addition",
			originalCases : [{ a : 1 }],
			addData : [{ b : "v1" }, { b : "v2" }, { b : "v3" }],
			expectedCases : [{ a : 1, b : "v1" }, { b : "v2" }, { b : "v3" }]
		},
		{
			title : "3x1, properties addition",
			originalCases : [{ a : 1 }, { a : 2 }, { a : 3 }],
			addData : [{ b : "v1" }],
			expectedCases : [{ a : 1, b : "v1" }, { a : 2 }, { a : 3 }]
		},
		{
			title : "0x3, properties addition",
			originalCases : [],
			addData : [{ b : "v1" }, { b : "v2" }, { b : "v3" }],
			expectedCases : [{ b : "v1" }, { b : "v2" }, { b : "v3" }]
		},
		{
			title : "3x0, properties addition",
			originalCases : [{ a : 1 }, { a : 2 }, { a : 3 }],
			addData : [],
			expectedCases : [{ a : 1 }, { a : 2 }, { a : 3 }]
		},
		{
			title : "undefined-cases considering",
			originalCases : [{ a : 1 }, undefined, { a : 3 }],
			addData : [undefined, { b : "v2" }, { b : "v3" }],
			expectedCases : [{ a : 1 }, { b : "v2" }, { a : 3, b : "v3" }]
		},
		{
			title : "null-cases considering",
			originalCases : [null, { a : 2 }, { a : 3 }],
			addData : [{ b : "v1" }, null, { b : "v3" }],
			expectedCases : [{ b : "v1" }, { a : 2 }, { a : 3, b : "v3" }]
		},
		{
			title : "undefined x 1",
			originalCases : undefined,
			addData : [{ b : "v1" }],
			expectedCases : [{ b : "v1" }]
		},
		{
			title : "null x 1",
			originalCases : null,
			addData : [{ b : "v1" }],
			expectedCases : [{ b : "v1" }]
		},
		{
			title : "1 x undefined",
			originalCases : [{ a : 1 }],
			addData : undefined,
			expectedCases : [{ a : 1 }]
		},
		{
			title : "1 x null",
			originalCases : [{ a : 1 }],
			addData : null,
			expectedCases : [{ a : 1 }]
		},
		{
			title : "[{}, undefined] x undefined",
			originalCases : [{ a : 1 }, undefined],
			addData : undefined,
			expectedCases : [{ a : 1 }]
		},
		{
			title : "undefined x [undefined, {}]",
			originalCases : undefined,
			addData : [undefined, { b : "v2" }],
			expectedCases : [{ b : "v2" }]
		},
		{
			title : "[null, {}] x null",
			originalCases : [null, { a : 2 }],
			addData : null,
			expectedCases : [{ a : 2 }]
		},
		{
			title : "null x [{}, null]",
			originalCases : null,
			addData : [{ b : "v1" }, null],
			expectedCases : [{ b : "v1" }]
		},
		{
			title : "Param name conflicts",
			originalCases : [{ a : 1 }, { a : 2 }, { a : undefined }, { a : null }, {}, {}, {}, {} ],
			addData : [{ a : 10 }, {  }, { a : 30  }, { a : 40 } , { a : 50 }, { a : undefined }, { a : null }, {}],
			expectedCases : [{ a : 1 }, { a : 2 }, { a : undefined }, { a : null }, { a : 50 }, { a : undefined }, { a : null }, {}]
		},
		{
			title : "title concatenation",
			originalCases : [{ title : "t1", a : 1 }, { title : "t2", a : 2 }, { a : 3 }],
			addData : [{ title : "d1", b : "v1" }, { b : "v2" }, { title : "d3", b : "v3" }],
			expectedCases : [{ title : "t1d1", a : 1, b : "v1" }, { title : "t2", a : 2, b : "v2" }, {title : "d3",  a : 3, b : "v3" }]
		}
	];

	var registerTest = function(testCase) {
		QUnit.test(testCase.title, function(assert){
			var actualTestCases = [];

			var record = recordCalls(QUnit, "test", function() {
				QUnit
					.cases(testCase.originalCases)
					.sequential(testCase.addData)
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
	
	for (var i = 0; i < sequentialTestCases.length; ++i) {
		var testCase = sequentialTestCases[i];
		registerTest(testCase);
	}


	QUnit.test("Don not change original test cases objects", function(assert){
		var originalCases = [{ a : 1 }, { a : 2 }];
		var addData = [{ b : "v1" }, { b : "v2" }];
		var actualTestCases = [];

		var record = recordCalls(QUnit, "test", function() {
			QUnit
				.cases(originalCases)
				.sequential(addData)
				.test("", function(actualTestCase){});
		});

		assert.deepEqual(originalCases, [{ a : 1 }, { a : 2 }]);
	});


	QUnit.test("Fluent calls support", function(assert){
		var originalCases = [{ a : 1 }, { a : 2 }];
		var addData1 = [{ b : "v1" }, { b : "v2" }];
		var addData2 = [{ c : ["arr1"] }, { c : ["arr2"] }];
		var addData3 = [{ d : { p : "p1"} }, { d : { p : "p2" } }];
		var actualTestCases = [];

		var record = recordCalls(QUnit, "test", function() {
			QUnit
				.cases(originalCases)
				.sequential(addData1)
				.sequential(addData2)
				.sequential(addData3)
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
				{ a : 1, b : "v1", c : ["arr1"], d : { p : "p1"} },
				{ a : 2, b : "v2", c : ["arr2"], d : { p : "p2"} }
			]
		);
	});
})();