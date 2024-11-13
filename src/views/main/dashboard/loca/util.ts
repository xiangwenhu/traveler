import { getItems } from "@/api/travel";
import { TravelItem } from "@/types/service";


export async function getTravelItems() {
  const res = await getItems({
    pageNum: 1,
    pageSize: 100
  });
  if (!res || res.code != 0 || !res.data) return [];

  const list = res.data.list || [];
  if (list.length == 0) return [];
  return list;
}


export interface LocaGeoFeatureCollection {
  "type": "FeatureCollection",
  features: LocaGeoFeatureItem[]
}

export interface LocaGeoFeatureItem {
  "type": "Feature",
  "geometry": {
    "type": string;
    "coordinates": [number, number]
  },
  properties: {
    "id": number;
    "location": string;
    "country": string;
    "date": string;
  }

}


export function buildFeatureCollection(items: TravelItem[]): LocaGeoFeatureCollection {

  const features: LocaGeoFeatureItem[] = items.map(t => (
    {
      "type": "Feature",
      geometry: {
        type: "Point",
        coordinates: [t.longitude, t.latitude]
      },
      properties: {
        "id": t.id!,
        "location": t.address,
        "country": "China",
        "date": t.date
      }
    }))

  return {
    "type": "FeatureCollection",
    features
  }

}

export function getMinMaxYear(items: TravelItem[]) {
  const its = items.map(it => new Date(it.date).getTime()).sort();
  return {
    min: new Date(its[0]).getFullYear(),
    max: new Date(its[its.length - 1]).getFullYear()
  }
}