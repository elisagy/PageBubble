/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var webpageCtrlStub = {
  index: 'webpageCtrl.index',
  show: 'webpageCtrl.show',
  create: 'webpageCtrl.create',
  upsert: 'webpageCtrl.upsert',
  patch: 'webpageCtrl.patch',
  destroy: 'webpageCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var webpageIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './webpage.controller': webpageCtrlStub
});

describe('Webpage API Router:', function() {
  it('should return an express router instance', function() {
    expect(webpageIndex).to.equal(routerStub);
  });

  describe('GET /api/webpages', function() {
    it('should route to webpage.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'webpageCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/webpages/:id', function() {
    it('should route to webpage.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'webpageCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/webpages', function() {
    it('should route to webpage.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'webpageCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/webpages/:id', function() {
    it('should route to webpage.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'webpageCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/webpages/:id', function() {
    it('should route to webpage.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'webpageCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/webpages/:id', function() {
    it('should route to webpage.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'webpageCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
