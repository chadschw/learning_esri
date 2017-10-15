"use strict";
var App = (function () {
    function App(_map) {
        this._map = _map;
        this._map.setBaseMap("dark-gray");
        this._map.addPointMarker(-117, 46);
        this._map.addPolyLine([
            [-117, 46],
            [-118, 47]
        ], [0, 0, 0], 4);
        this._map.addPolyLine([
            [-117.206947, 46.7222495],
            [-117.1998659, 46.7377516],
            [-117.1744553, 46.7471534],
            [-117.1641556, 46.7386249],
            [-117.1759573, 46.7251235],
            [-117.1951405, 46.716003]
        ], [0, 0, 0, 0.8], 12);
    }
    return App;
}());
window.onload = function () {
    var map = new EsriMap();
    map.createMap("viewDiv", [-117.206947, 46.7222495], 15).then(function () {
        new App(map);
    });
};
