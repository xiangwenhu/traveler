declare global {
    interface Window {
      AMap: typeof AMap;
    }
    namespace AMap {

        export class ElasticMarker extends AMap.Marker {
            constructor(options: AMap.MarkerOptions & {
                styles: any[]
            }){
                super(options)
            }
        }
    }

}

export  {}