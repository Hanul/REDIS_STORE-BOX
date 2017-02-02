REDIS_STORE_EXAMPLE.MAIN = METHOD(function() {
	'use strict';
	
	var
	// redis store
	redisStore = REDIS_STORE('test');

	redisStore.save({
		name : 'msg',
		value : 'Hello World!'
	});
	
	DELAY(1, function() {
		
		redisStore.get('msg', function(value) {
			
			ok(value === 'Hello World!');
		});
		
		redisStore.list(function(values) {
			
			ok(CHECK_ARE_SAME([values, {
				msg : 'Hello World!'
			}]));
		});
		
		redisStore.count(function(count) {
			
			ok(count === 1);
		});
	});
});
