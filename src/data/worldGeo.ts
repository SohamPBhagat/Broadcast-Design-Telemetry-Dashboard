import { feature } from 'topojson-client';
import world110m from 'world-atlas/countries-110m.json';

// Convert TopoJSON to GeoJSON FeatureCollection
export const worldCountriesGeoJSON = feature(
  world110m as any,
  world110m.objects.countries as any
) as unknown as GeoJSON.FeatureCollection;

export const worldLandGeoJSON = feature(
  world110m as any,
  world110m.objects.land as any
) as unknown as GeoJSON.FeatureCollection;
