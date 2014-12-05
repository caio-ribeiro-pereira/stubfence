Package.describe({
  name: 'raix:stubfence',
  summary: 'Fence/stop method stubs running, temporarily stop latency compensation',
  version: '1.0.0-rc1',
  git: ''
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use(['mongo', 'ddp']);
  api.addFiles('util.js');
  api.addFiles('nostub.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('raix:stubfence');
  api.addFiles('nostub-tests.js');
});
