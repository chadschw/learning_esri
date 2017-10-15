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

    var map = new Map({
        basemap: "hybrid"
    });

    var view = new MapView({
        center: [-80, 35],
        container: "viewDiv",
        map: map,
        zoom: 3
    });
    
    // First create a line geometry (this is the Keystone pipeline)
    var polylineGeometry = createPolyLineGeometry(
        [
            [-111.30, 52.68],
            [-98, 49.5],
            [-93.94, 29.89]
        ]);
    
        // Create a symbol for drawing the line
    var lineSymbol = createLineSymbol([50, 50, 50], 4);
    
    // Create an object for storing attributes related to the line
    var lineAtt = createLineAttributes("Keystone Pipeline", "TransCanada", "3,456 km");
    var popupTemplate = createPopupTemplate();
    var polylineGraphic = createPolyLineGraphic(
        polylineGeometry,
        lineSymbol,
        lineAtt,
        popupTemplate);
    
    // Add the line graphic to the view's GraphicsLayer
    view.graphics.add(polylineGraphic);
    view.graphics.add(createPointGraphic(-117.1817, 46.7298));

    view.on("click", function(event) { 
        console.log(event); 

        view.graphics.add(createPointGraphic(
            event.mapPoint.longitude,
            event.mapPoint.latitude
        ));
    });

    view.on("double-click", function(event) {
        event.stopPropagation();
        // if the user clicked on a graphic, remove it.
        view.hitTest(event)
            .then(function(response) {
                view.graphics.remove(response.results[0].graphic);
            });
    });

    function createPolyLineGeometry(paths) {
        return {
            type: "polyline",
            paths: paths
        }
    }

    function createLineSymbol(rgb, width) {
        return {
            type: "simple-line",
            color: rgb,
            width: width
        }
    }
    
    function createLineAttributes(name, owner, length) {
        return {
            Name: name,
            Owner: owner,
            Length: length
        }
    }
    
    function createPopupTemplate() {
        return {  // autocasts as new PopupTemplate()
            title: "{Name}",
            content: [{
                type: "fields",
                fieldInfos: [{
                    fieldName: "Name"
                }, {
                    fieldName: "Owner"
                }, {
                    fieldName: "Length"
                }]
            }]
        }
    }
    
    function createPolyLineGraphic(geometry, symbol, attributes, popupTemplate) {
        return new Graphic({
            geometry: geometry,
            symbol: symbol,
            attributes: attributes,
            popupTemplate: popupTemplate
        });
    }

    function createPointGraphic(lng, lat) {
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

        return new Graphic({
            geometry: point,
            symbol: markerSymbol
        });
    }
});

