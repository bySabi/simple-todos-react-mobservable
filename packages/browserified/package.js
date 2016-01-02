Package.describe({
  summary: 'Browserified NPM´s',
  version: '0.1.0',
});

Npm.depends({
  'externalify': '0.1.0',
  'mobservable': '1.2.1',
  'mobservable-react': '2.1.1'
});

Package.onUse(function (api) {
  api.use([
    'ecmascript',
    'react@0.14.3',
    'cosmos:browserify@0.9.3'
  ]);
  api.addFiles([
    'package.browserify.js',
    'packages.browserify.options.json',
  ], 'client');
  api.addFiles('server.js', 'server');
  api.export([
    'mobservable',
    'mobservableReact'
  ]);
});
