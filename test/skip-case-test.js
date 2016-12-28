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
