var fs    = require('fs'),
    argv  = require('optimist').demand('browser').argv;

var topLevelNamespace = JSON.parse(fs.readFileSync("namespaces.json", "utf8"));
var browserUrl = 'http://localhost:8000/application/widgetbrowser/source/'


var runComponentTests = function(path, component) {
  require(path.replace(/#/g, '/')).test(argv.browser, browserUrl);
}

var runComponentsTests = function(path, components) {
  for(var i = 0; i < components.length; i++) {
    var component = components[i];
    runComponentTests(path + component + ".js", component);
  }
}

var runNamespaceTests = function(rootPath, namespace) {
  for (var key in namespace) {
    describe(key, function() {
      var value = namespace[key];
      var path = rootPath + key + "#";
      if (Array.isArray(value)) {
        runComponentsTests(path, value);
      } else {
        runNamespaceTests(path, value);
      }  
    })
  }
}

runNamespaceTests("./tests/", topLevelNamespace);