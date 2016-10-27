//var skipCaseArray = [
//    {
//        title: 'skip default value',
//        cases: [
//            {
//                title: 'skip default is false',
//                expected: false
//            },
//            {
//                title: 'skip is false',
//                skip: false,
//                expected: false
//            },
//            {
//                title: 'skip is true',
//                skip: true,
//                expected: true
//            },
//        ]
//    }
//];

//var QUnitMock = QUnit;
//QUnitMock.skip = function(message)
//{
//    QUnitMock.skipMessage = message;
//};

QUnit.module('Skip case');
QUnit.skip('Check if QUnit.skip() function is available.');
QUnit.cases([
    {
        title: 'skip default is false',
        expected: false
    },
    {
        title: 'skip is false',
        skip: false,
        expected: false
    },
    {
        title: 'skip is true',
        skip: true,
        expected: true
    },
]).test('skip default value',
function(params, assert)
{
    console.log(params);
    assert.ok(!params.expected);
});


//parameterizeFixture.registerModule(
//    QUnit,
//    'Skip case test',
//    skipCaseArray,
//    function(qunit, assert, testName, testCases)
//    {
//        console.log(testName, testCases);
//        var title = "some test title";
//		var record = recordCalls(qunit, testName, function()
//        {
//			qunit
//				.cases(testCases)
//				[testName](title, function(testCase){console.log(testCase);});
//		});
//
//		var recordedArguments = record.getArguments();
//		for (var i = 0; i < recordedArguments.length; ++i) {
//			//var isSkiped = record.neverCalled();
//			//assert.equal(recordedArguments[i][0], title);
//            console.log(recordedArguments[i]);
//		}
//    }
//);
