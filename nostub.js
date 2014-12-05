var inFence = 0;

_DDP.Connection.prototype.stubFence = function(names, f) {
  var self = this;

  if (++inFence !== 1) {
    inFence--;
    throw new Error('stubFence cannot lock since another stubFence is running');
  }

  // Take string or array of string
  if (names === ''+names) names = [names];

  // Carrier for super of methods
  var supers = {};

  // Store supers
  _.each(names, function(name) {

    // Check that the method exists
    if (self._methodHandlers[name]) {
      supers[name] = self._methodHandlers[name];
    } else {
      throw new Error('stubFence could not find method "' + name + '"');
    }

  });

  // Check that we got any supers to stubFence
  if (names.length) {

    // Remove the stub
    _.each(supers, function(f, name) {
      self._methodHandlers[name] = null;
    });

    // Run the code
    f();

    // Insert the stub again
    _.each(supers, function(f, name) {
      self._methodHandlers[name] = f;
    });    
  } else {
    throw new Error('stubFence, no methods found');
  }

  inFence--;
};

Mongo.Collection.prototype.stubFence = function(f) {
  var self = this;

  // Make sure we got a collection name
  if (!self._name)
    throw new Error('Dont run stubFence on an annonymous collection');

  // Make sure we got a connection
  if (self._connection) {
    // The main collection methods
    var collectionMethods = [
      '/' + self._name + '/insert',
      '/' + self._name + '/remove',
      '/' + self._name + '/update'
    ];

    // Run the connection stubFence
    self._connection.stubFence(collectionMethods, f);

  } else {
    throw new Error('Dont run stubFence on a collection with no connection');
  }
};