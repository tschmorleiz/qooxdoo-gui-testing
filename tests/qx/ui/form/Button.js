var chai        = require('chai'),
    assert      = chai.assert,
    expect      = chai.expect,
    Q           = require("q"),
    webdriverjs = require('webdriverjs'),
    utils       = require('../../../../utils');

module.exports.test = function(browser, url) {
  describe('qx.ui.form.Button', function(){

    this.timeout(99999999);
    var client = {};
    var qxhButton1 = '*/qxc.application.formdemo.FormItems/child[2]/*/qx.ui.container.Composite/child[1]'
    var proxyClass = {};

    // prepare proxy class
    before(function(done){
      client = webdriverjs.remote({desiredCapabilities: {browserName: browser}});
      Q.ninvoke(client.init(), "call")
        .then(function() {
          return utils.classByQxh(client, url, qxhButton1);
        })
        .then(function(res) {
          proxyClass = res.class;
        })
        .done(done);

    });

    // check that Button class was indeed found
    it("correct class found", function(done) {
      assert.equal(proxyClass.classname, "qx.ui.form.Button");
      client.call(done);
    });

    // check that label can be set correctly
    it('button label set correctly',function(done) {
      var newLabel = Math.random().toString(36).substring(7);

      proxyClass.setLabel(newLabel)
        .then(function() {
          return proxyClass.getLabel();
        })
        .then(function(res) {
          assert.equal(res, newLabel);
        })
        .done(done);
    });

    // fin
    after(function(done) {
        client.end(done);
    });
  });  
}
