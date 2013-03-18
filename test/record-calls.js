var recordCalls = function(qunit, methodName, action) {
	var realMethod = qunit[methodName];
	var callsArguments = [];
    var calls = 0;

	qunit[methodName] = function() {
		callsArguments.push(arguments);
        calls++;
	};

	try {
		action();
	}
	finally {
		qunit[methodName] = realMethod;
	}
	
	return {
		getArguments : function() { return callsArguments; },
		neverCalled : function() { return callsArguments.length == 0; },
        calledTimes: function () { return calls; }
	};
};
