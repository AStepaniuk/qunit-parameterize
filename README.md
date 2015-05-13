Parameterize - A QUnit plugin For Running Parameterized Tests
============================================================

This plugin provides an ability to specify the list of test cases outside of the test function.
When the list of test cases is provided then separated test is added to run per each test case.
Test case is passed to the test function as a parameter.

Benefits are:

 * Test data and test methods are not mixed  
 * Tests are data driven  
 * Tests are more DRY

##Download

 * [qunit-parameterize.js v0.4](https://raw.github.com/AStepaniuk/qunit-parameterize/v0.4/qunit-parameterize.js)
 * [npm](https://npmjs.org/package/qunit-parameterize) : $ npm install qunit-parameterize
 * [bower](http://bower.io/) : $ bower install qunit-parameterize

##Usage

```js
QUnit
	.cases(testCasesList)
	.test(title, [expect], callback);
```

####Example

Given test function is:

```js
	function sum(a, b) { return a + b; }
```

Then the following code:

```js
QUnit
	.cases([
		{ a : 2, b : 2, expectedSum : 4 },
		{ a : 5, b : 5, expectedSum : 10 },
		{ a : 40, b : 2, expectedSum : 42 }
	])
	.test("Sum test", function(params) {
		var actualSum = sum(params.a, params.b);
		equal(actualSum, params.expectedSum);
	});
```

is eqivalent to:

```js
QUnit.test("Sum test", function() {
	var actualSum = sum(2, 2);
	equal(actualSum, 4);
});
QUnit.test("Sum test", function() {
	var actualSum = sum(5, 5);
	equal(actualSum, 10);
});
QUnit.test("Sum test", function() {
	var actualSum = sum(40, 2);
	equal(actualSum, 42);
});
```

## Test cases validation

Since v0.4 test fails when empty test cases set (or null or undefined) is provided.
See [Issue#4](https://github.com/AStepaniuk/qunit-parameterize/issues/4) for details.

##Assert parameter

Parameter assert is provided as the second parameter to the test function.

####Example

```js
QUnit
	.cases([
		{ a : 1, b : 1, expectedSum : 2 }
	])
	.test("Sum test", function(params, assert) {
		var actualSum = sum(params.a, params.b);
		assert.equal(actualSum, params.expectedSum);
	});
```

##Title suffix

When special parameter 'title' is specifies in test case
then test case title is added as suffix to the test title.

####Example

The following code:

```js
QUnit
	.cases([
		{ title : "100+100", a : 100, b : 100, expectedSum : 200 },
		{ title : "5+0", a : 5, b : 0, expectedSum : 5 }
	])
	.test("Sum test", function(params) {
		var actualSum = sum(params.a, params.b);
		equal(actualSum, params.expectedSum);
	});
```

is equivalent to:

```js
QUnit.test("Sum test[100+100]", function() {
	var actualSum = sum(100, 100);
	equal(actualSum, 200);
});
QUnit.test("Sum test[5+0]", function() {
	var actualSum = sum(5, 0);
	equal(actualSum, 5);
});
```

##Chaining
(available since v0.2)

For running several tests over the same test data.

####Example

```js
QUnit
	.cases([
		'.container',
		'body .container'
	])
	.test("Should get a single jquery element", function(param) {
		equal($(param).length, 1);
	})
	.test("Should have class of jquery element", function(param) {
		ok($(param).hasClass('container'));
	});
```

##Test Cases Generation
(available since v0.3)

Test cases can be generated based on provided test data.

###Sequential

Generates the set of test cases based on provided pairs of test data.

####Example

The following code

```js
QUnit
	.cases([
		{ a : 1 },
		{ a : 2 },
		{ a : null }
	])
	.sequential([
		{ b : "one" },
		{ b : "two" }
	])
	.test(...);
```

Is equivalent to:

```js
QUnit
	.cases([
		{ a : 1, b : "one" },
		{ a : 2, b : "two" },
		{ a : null }
	])
	.test(...);
```

The total count of test cases is the maximum count of cases from 'cases()' and 'sequential()'.

When some test case should be skipped then 'null' or 'undefined' can be passed at its place:

####Example

The following code

```js
QUnit
	.cases([
		{ a : 1 },
		{ a : 2 },
		{ a : null }
	])
	.sequential([
		{ b : "one" },
		null,
		{ b : "null" }
	])
```

produces test cases:

```js
[
	{ a : 1, b : "one" },
	{ a : 2 },
	{ a : null, b : "null" }
]
```

###Combinatorial

Generates the test cases combinations based on provided test data.

####Example

The following code

```js
QUnit
	.cases([
		{ a : 1 },
		{ a : 2 }
	])
	.combinatorial([
		{ b : "X" },
		{ b : "Y" }
	])
```

produces test cases:

```js
[
	{ a : 1, b : "X" },
	{ a : 1, b : "Y" },
	{ a : 2, b : "X" },
	{ a : 2, b : "Y" }
]
```

When 'null' or 'undefined' is passed as test data then original test case is not changed:

####Example

The following code

```js
QUnit
	.cases([
		{ a : 1 },
		{ a : 2 }
	])
	.combinatorial([
		{ b : "X" },
		null
	])
```

produces test cases:

```js
[
	{ a : 1, b : "X" },
	{ a : 1 },
	{ a : 2, b : "X" },
	{ a : 2 }
]
```

###Parameter names conflict resolution

If parameter with the same name is presented in both 'cases()' and in 'sequential()/combinatorial()'
then value from 'cases()' is prefered to generate resulting test case:

####Example

The following code

```js
QUnit
	.cases([
		{ a : 1 },
		{ a : 2 }
	])
	.sequential([
		{ a : 3 },
		{ a : 4 }
	])
```

produces test cases:

```js
[
	{ a : 1 },
	{ a : 2 }
]
```

###Title Concatenation

If parameter 'title' is presented in both 'cases()' and in 'sequential()/combinatorial()'
then resulting 'title' value is a concatenation of both original values:

####Example

The following code

```js
QUnit
	.cases([
		{ title : "case1", a : 1 },
		{ title : "case2", a : 2 }
	])
	.combinatorial([
		{ title : " mix1", b : "X" },
		{ title : " mix2", b : "Y" }
	])
```

produces test cases:

```js
[
	{ title : "case1 mix1", a : 1, b : "X" },
	{ title : "case1 mix2", a : 1, b : "Y" },
	{ title : "case2 mix1", a : 2, b : "X" },
	{ title : "case2 mix2", a : 2, b : "Y" }
]
```

###Chaining Generation

It is possible to apply multiple 'sequential()/combinatorial()' calls to the same test cases set.

####Example

```js
QUnit
	.cases([...])
	.combinatorial([...])
	.sequential([...])
	.combinatorial([...])
	.sequential([...])
```
