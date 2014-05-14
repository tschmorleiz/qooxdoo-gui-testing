var Q           = require("q");


function Button(qxh, hash, client) {
  this.classname = "qx.ui.form.Button";
  this.qxh = qxh;
  this.hash = hash;
  this.client = client;
  console.log(hash);
};

Button.prototype.execute = function(method) {
  var script = "return qx.core.ObjectRegistry.fromHashCode('"+ this.hash + "')." + method;
  return Q.ninvoke(this.client, "execute", script, null)
    .then(function(res) {
      var deferred = Q.defer();
      deferred.resolve(res.value);
      return deferred.promise;
    })
};

Button.prototype.setLabel = function(label) {
  return this.execute("setLabel('" + label + "')");
};

Button.prototype.getLabel = function(cb) {
  return this.execute("getLabel()");
};

Button.prototype.clickNatively = function() {
  Q.ninvoke(this.client, "click", "#" + this.hash)
};

module.exports = Button;