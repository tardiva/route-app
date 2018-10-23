const createMockFuncsFromArray = (instance, names = []) => {
  names.forEach(name => {
    instance[name] = jest.fn();
  });
};

const createMVCObject = instance => {
  const listeners = {};
  instance.listeners = listeners;

  instance.addListener = jest
    .fn((event, fn) => {
      listeners[event] = listeners[event] || [];
      listeners[event].push(fn);
    });
  instance.trigger = jest
    .fn((event) => {
      const index = listeners[event];

      if (index !== -1) {
        listeners[event].forEach((listener) => {
          listener()
        });
      }
    })
};

const google =  {
  maps: {
    Map: jest.fn(function(mapDiv, opts) {
      this.mapDiv = mapDiv;
      this.opts = opts;
      createMVCObject(this);
      createMockFuncsFromArray(this, [
        'setCenter'
      ]);
      this.getCenter = jest.fn(() => this.opts.center);
    }),
    LatLng: jest.fn(function (lat, lng) {
      this.lat = jest.fn(() => lat);
      this.lng = jest.fn(() => lng);
    }),
    Polyline: jest.fn(function () {
      createMockFuncsFromArray(this, ['setMap']);
      this.getPath = jest.fn(() => {
        return {
          insertAt: jest.fn(),
          removeAt: jest.fn(),
          getAt: jest.fn(),
          setAt: jest.fn()
        }
      });
    }),
    InfoWindow: jest.fn(function() {
      createMockFuncsFromArray(this, ['setContent', 'open']);
    }),
    Marker: jest.fn(function () {
      createMVCObject(this);
      createMockFuncsFromArray(this, ['setMap']);
      this.getPosition = jest.fn(() => ({lat: jest.fn(() => 0), lng: jest.fn(() => 0)}))
    })
  }
};

export default google;