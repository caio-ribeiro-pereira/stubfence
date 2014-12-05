raix:stubfence
==============

This tiny package creates a method stub fence, effectivly stops latency compensation temporarily.

Why would you ever do this?
Its an odd egde case we have in grounddb. GroundDB resumes "outstanding" method calls - this is normally not a problem since we previously worked around this by removing data before inserting etc.

But we cannot catch reruns that mutate the data incrementally eg. updating data with `$inc`, `$dec`, `$push`, `$pull`.

So what we really just wanted to do was a plain old server method only call.

Mongo.Collections are pr. default rigged with client-side method stubs, eg. a collection `foo` would have following methods rigged on client and server pr. default:

* `/foo/insert`
* `/foo/update`
* `/foo/remove`

For the groundDB project we want code to be as non-intrusive as possible - this makes it easier to maintain eg. relying on core functionallity in Meteor keeps the footprint down.

This package actually reduces the original workaround by approx 50%

How does this work?

On a collection:
```js
    var foo = new Mongo.Collection('foo');

    foo.stubFence(function() {
        // All inserts, updates, remove in here will be without
        // latencycompensation
        foo.insert({ name: 'foo' });
    });
```

On a connection
```js
    Meteor.connection.stubFence(function() {
        // If theres a client-side definition / stub for this method it
        // will be blocked and only run on the server
        Meteor.call('bar');
    });
```

