var skipCaseArray = [
   {
       title: 'skip default value',
       cases: [
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
       ]
   }
];

QUnit.module('Skip case');
QUnit.skip('Check if QUnit.skip() function is available.');
QUnit.cases([
    {
        title: '_skip default is false',
        expected: false
    },
    {
        title: '_skip is false',
        _skip: false,
        expected: false
    },
    {
        title: '_skip is true',
        _skip: true,
        expected: true
    }
]).test('_skip default value',
function(params, assert)
{
    assert.notOk(params.expected);
});
