
function EsriMap() {
    this.map;
    this.view;
    this.Map;
    this.MapView;
    this.Graphic;

    this.validBaseMapNames = "streets satellite hybrid topo gray dark-gray oceans national-geographic terrain osm dark-gray-vector gray-vector streets-vector topo-vector streets-night-vector streets-relief-vector streets-navigation-vector";
}

EsriMap.prototype.createMap = function (containerId, center, zoom) {
    let self = this;

    return new Promise(function (resolve, reject) {
        require([
            "esri/Map",
            "esri/views/MapView",
            "esri/Graphic",
            "dojo/domReady!"
        ], function (
            Map,
            MapView,
            Graphic
        ) {
                self.Map = Map;
                self.MapView = MapView;
                self.Graphic = Graphic;

                self._setupMap();
                self._setupMapView(containerId, center, zoom);
                self._setupEventListeners();
                resolve();
        });
    });
}

EsriMap.prototype._setupMap = function () {
    this.map = new this.Map({
        basemap: "hybrid"
    });
}

EsriMap.prototype._setupMapView = function (containerId, center, zoom) {
    this.view = new this.MapView({
        center: center,
        container: containerId,
        map: this.map,
        zoom: zoom
    });
}

EsriMap.prototype._setupEventListeners = function () {
    self = this;
    this.view.on("click", function (event) {
        //console.log(event);
        self.addPointMarker(event.mapPoint.longitude, event.mapPoint.latitude);
    });

    this.view.on("double-click", function (event) {
        event.stopPropagation();
        // if the user double clicks on a graphic, remove it.
        self.view.hitTest(event)
            .then(function (response) {
                self.view.graphics.remove(response.results[0].graphic);
            });
    });
}

EsriMap.prototype.setBaseMap = function (type) {
    if (!this._typeIsValid(type)) {
        console.log(type + " is not a valid basemap. Valid basemaps are: " + this.validBaseMapNames);
        return;
    }
    this.map.basemap = type;
}

EsriMap.prototype._typeIsValid = function (type) {
    // todo, this isn't very good checking... example: 'eets' would match :(.
    return (this.validBaseMapNames.indexOf(type) > -1) ? true : false;
}

EsriMap.prototype.addPointMarker = function (lng, lat) {

    var point = {
        type: "point",
        x: lng,
        y: lat,
        spatialReference: { wkid: 4326 }
    }

    var markerSymbol = {
        type: "simple-marker",
        color: [226, 119, 40],
        outline: {
            color: [255, 255, 255],
            width: 2
        }
    }

    this.view.graphics.add(
        new this.Graphic({
            geometry: point,
            symbol: markerSymbol
        })
    );
}

EsriMap.prototype.addPolyLine = function (lngLats, rgbColor, width) {
    this.view.graphics.add(
        this._createPolyLineGraphic(
            this._createPolyLineGeometry(lngLats),
            this._createLineSymbol(rgbColor, width)
        )
    );
}

EsriMap.prototype._createPolyLineGeometry = function (lngLats) {
    return {
        type: "polyline",
        paths: lngLats
    }
}

EsriMap.prototype._createLineSymbol = function (rgbColor, width) {
    return {
        type: "simple-line",
        color: rgbColor,
        width: width,
        style: "solid",
        cap: "round",
        join: "round"
    }
}

EsriMap.prototype._createPolyLineGraphic = function (geometry, lineSymbol) {
    return new this.Graphic({
        geometry: geometry,
        symbol: lineSymbol,
    });
}

//     // First create a line geometry (this is the Keystone pipeline)
    //     var polylineGeometry = createPolyLineGeometry(
    //         [
    //             [-111.30, 52.68],
    //             [-98, 49.5],
    //             [-93.94, 29.89]
    //         ]);

    //         // Create a symbol for drawing the line
    //     var lineSymbol = createLineSymbol([50, 50, 50], 4);

    //     // Create an object for storing attributes related to the line
    //     var lineAtt = createLineAttributes("Keystone Pipeline", "TransCanada", "3,456 km");
    //     var popupTemplate = createPopupTemplate();
    //     var polylineGraphic = createPolyLineGraphic(
    //         polylineGeometry,
    //         lineSymbol,
    //         lineAtt,
    //         popupTemplate);

    //     // Add the line graphic to the view's GraphicsLayer
    //     view.graphics.add(polylineGraphic);
    //     view.graphics.add(createPointGraphic(-117.1817, 46.7298));

    //     view.on("click", function(event) { 
    //         console.log(event); 

    //         view.graphics.add(createPointGraphic(
    //             event.mapPoint.longitude,
    //             event.mapPoint.latitude
    //         ));
    //     });

    //     view.on("double-click", function(event) {
    //         event.stopPropagation();
    //         // if the user clicked on a graphic, remove it.
    //         view.hitTest(event)
    //             .then(function(response) {
    //                 view.graphics.remove(response.results[0].graphic);
    //             });
    //     });

    //     function createPolyLineGeometry(paths) {
    //         return {
    //             type: "polyline",
    //             paths: paths
    //         }
    //     }

    //     function createLineSymbol(rgb, width) {
    //         return {
    //             type: "simple-line",
    //             color: rgb,
    //             width: width
    //         }
    //     }

    //     function createLineAttributes(name, owner, length) {
    //         return {
    //             Name: name,
    //             Owner: owner,
    //             Length: length
    //         }
    //     }

    //     function createPopupTemplate() {
    //         return {  // autocasts as new PopupTemplate()
    //             title: "{Name}",
    //             content: [{
    //                 type: "fields",
    //                 fieldInfos: [{
    //                     fieldName: "Name"
    //                 }, {
    //                     fieldName: "Owner"
    //                 }, {
    //                     fieldName: "Length"
    //                 }]
    //             }]
    //         }
    //     }

    //     function createPolyLineGraphic(geometry, symbol, attributes, popupTemplate) {
    //         return new Graphic({
    //             geometry: geometry,
    //             symbol: symbol,
    //             attributes: attributes,
    //             popupTemplate: popupTemplate
    //         });
    //     }

    //     function createPointGraphic(lng, lat) {
    //         var point = {
    //             type: "point",
    //             x: lng,
    //             y: lat,
    //             spatialReference: { wkid: 4326 }
    //         }

    //         var markerSymbol = {
    //             type: "simple-marker",
    //             color: [226, 119, 40],
    //             outline: {
    //                 color: [255, 255, 255],
    //                 width: 2
    //             }
    //         }

    //         return new Graphic({
    //             geometry: point,
    //             symbol: markerSymbol
    //         });
    //     }




