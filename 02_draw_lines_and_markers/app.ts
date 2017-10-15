declare function createEsriMap(containerId: string): EsriMap;

declare class EsriMap {
    createMap(containerId: string, center: Array<number>, zoom: number): Promise<any>;
    setBaseMap(type: string): void;
    addPointMarker(lng: number, lat: number): void;
    addPolyLine(paths: Array<Array<number>>, rgbColor: Array<number>, width: number): void;
}

class App {
    constructor(private _map: EsriMap) {
        this._map.setBaseMap("dark-gray");
        this._map.addPointMarker(-117, 46);
        this._map.addPolyLine(
            [
                [-117, 46], 
                [-118, 47]
            ],
            [0, 0, 0],
            4
        );
        this._map.addPolyLine(
            [
                [-117.206947, 46.7222495],
                [-117.1998659, 46.7377516],
                [-117.1744553, 46.7471534],
                [-117.1641556, 46.7386249],
                [-117.1759573, 46.7251235],
                [-117.1951405, 46.716003]
            ],
            [0, 0, 0, 0.8],
            12
        )
    }
}

window.onload = () => {
    let map = new EsriMap();
    map.createMap("viewDiv", [-117.206947, 46.7222495], 15).then(() => {
        new App(map);
    });
}