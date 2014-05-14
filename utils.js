var Q = require("q");
var Qretry = require("qretry");
var webdriverjs = require('webdriverjs');

// wait for tab to be visible
exports.waitForTab = function(client) {
  var script = "return findByQxh('*/qxc.application.formdemo.FormItems')"
  
  return Qretry(function() {
    return Q.ninvoke(client, "execute", script, null)
  })
}


// get instantiated class of widget at DOM position by qxh expression 
exports.classByQxh = function(client, url, qxh) {

  return Q.ninvoke(client.url(url), "title")

    // wait for tab
    .then(function() {
      return exports.waitForTab(client)
    })
    // find class, cache it on client, and return class name
    .then(function() {
      var script = "cqxh = findByQxh('" + qxh + "');"
      script += "cclass = qx.ui.core.Widget.getWidgetByElement(cqxh);";
      script += "cqxh.id = cclass.$$hash;";
      script += "return [cclass.classname, cclass.$$hash];"
      console.log(script);
      return Q.ninvoke(client, "execute", script, null);
      
    })
    // eventually populate proxy class
    .then(function(res) {
      var className = res.value[0];
      var hash = res.value[1];
      try {
        var classPath = "./components/" + className.replace(/\./g, '/')
        var Class = require(classPath);
        var deferred = Q.defer();
        deferred.resolve({className: className, class: new Class(qxh, hash, client)});
        return deferred.promise;  
      } catch(e) {
        throw new Error("Proxy class for " + className + " not available.");
      }
    }, function(err) {
      if (err.orgStatusMessage.indexOf('Qxh Locator') != 0) {
        throw new Error("Qxh locator failed.");
      }
      else {
        throw new Error("Unknown error.");
      }
    })
}


