import { useEffect, useRef} from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Property } from '../types/property';

interface PropertyMapProps {
  properties: Property[];
  selectedProperty?: Property;
  onPropertySelect?: (property: Property) => void;
}

const PropertyMap = ({ properties, selectedProperty, onPropertySelect }: PropertyMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  // const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Utiliser le token Mapbox fourni
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2FpZHdlZGUiLCJhIjoiY21iMGwxbGp0MG14ZDJsczdjMDljZjl4eCJ9.OFeZLhhrH8lHgA3oWiF-Qw';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [2.3522, 46.6033], // Centre de la France
      zoom: 5,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Initialize popup
    popupRef.current = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      maxWidth: '300px',
      className: 'property-popup'
    });

    map.current.on('load', () => {
      // Add clustering source
      map.current?.addSource('properties', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: properties.map(property => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: property.location.coordinates
            },
            properties: {
              id: property.id,
              title: property.title,
              price: property.price,
              type: property.type,
              city: property.location.city,
              surface: property.surface,
              rooms: property.rooms,
              image: property.images?.[0]
            }
          }))
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });

      // Add cluster circles
      map.current?.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'properties',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#3B82F6',
            10,
            '#1D4ED8',
            30,
            '#1E40AF'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            10,
            30,
            30,
            40
          ]
        }
      });

      // Add cluster count labels
      map.current?.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'properties',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        },
        paint: {
          'text-color': '#ffffff'
        }
      });

      // Add individual property points
      map.current?.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'properties',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#3B82F6',
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Add property labels
      map.current?.addLayer({
        id: 'property-labels',
        type: 'symbol',
        source: 'properties',
        filter: ['!', ['has', 'point_count']],
        layout: {
          'text-field': ['concat', ['number-format', ['get', 'price'], { 'max-fraction-digits': 0 }], '€'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 10,
          'text-offset': [0, -2.5],
          'text-anchor': 'top'
        },
        paint: {
          'text-color': '#1f2937',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1
        }
      });

      // Click events
      map.current?.on('click', 'clusters', (e) => {
        const features = map.current?.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        
        if (features && features[0]) {
          const clusterId = features[0].properties?.cluster_id;
          (map.current?.getSource('properties') as mapboxgl.GeoJSONSource)?.getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
              if (!err && map.current && features[0].geometry.type === 'Point') {
                map.current.easeTo({
                  center: features[0].geometry.coordinates as [number, number],
                  zoom: zoom || 0
                });
              }
            }
          );
        }
      });

      // Handle clicks on individual property markers
      map.current?.on('click', 'unclustered-point', (e) => {
        const features = map.current?.queryRenderedFeatures(e.point, {
          layers: ['unclustered-point']
        });
        
        if (features && features[0] && features[0].properties && features[0].geometry.type === 'Point') {
          const props = features[0].properties;
          const propertyId = props.id;
          
          // Find the full property object from our properties array
          const property = properties.find(p => p.id === propertyId);
          
          if (property) {
            // Create popup content
            const popupContent = `
              <div class="p-2">
                ${property.images && property.images.length > 0 ? 
                  `<img src="${property.images[0]}" alt="${property.title}" class="w-full h-32 object-cover rounded-t mb-2"/>` : ''}
                <h3 class="font-bold text-sm">${property.title}</h3>
                <p class="text-blue-600 font-semibold">${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(property.price)}</p>
                <div class="text-xs text-gray-600 mt-1">
                  <p>${property.rooms} pièce${property.rooms > 1 ? 's' : ''} · ${property.surface} m²</p>
                  <p>${property.location.city}</p>
                </div>
              </div>
            `;

            // Show popup
            if (popupRef.current) {
              popupRef.current
                .setLngLat(features[0].geometry.coordinates as [number, number])
                .setHTML(popupContent)
                .addTo(map.current!);
            }

            // Call onPropertySelect if available
            if (onPropertySelect) {
              onPropertySelect(property);
            }
          }
        }
      });

      // Change cursor on hover
      map.current?.on('mouseenter', 'clusters', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });
      
      map.current?.on('mouseleave', 'clusters', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });

      map.current?.on('mouseenter', 'unclustered-point', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });
      
      map.current?.on('mouseleave', 'unclustered-point', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update map data when properties change
  useEffect(() => {
    if (map.current && map.current.isStyleLoaded()) {
      const source = map.current.getSource('properties') as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: 'FeatureCollection',
          features: properties.map(property => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: property.location.coordinates
            },
            properties: {
              id: property.id,
              title: property.title,
              price: property.price,
              type: property.type,
              city: property.location.city,
              surface: property.surface,
              rooms: property.rooms,
              image: property.images?.[0]
            }
          }))
        });
      }
    }
  }, [properties]);

  // Handle selected property
  useEffect(() => {
    if (selectedProperty && map.current) {
      map.current.flyTo({
        center: selectedProperty.location.coordinates,
        zoom: 14,
        duration: 1500
      });

      // Show popup for selected property
      if (popupRef.current) {
        const popupContent = `
          <div class="p-2">
            ${selectedProperty.images && selectedProperty.images.length > 0 ? 
              `<img src="${selectedProperty.images[0]}" alt="${selectedProperty.title}" class="w-full h-32 object-cover rounded-t mb-2"/>` : ''}
            <h3 class="font-bold text-sm">${selectedProperty.title}</h3>
            <p class="text-blue-600 font-semibold">${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(selectedProperty.price)}</p>
            <div class="text-xs text-gray-600 mt-1">
              <p>${selectedProperty.rooms} pièce${selectedProperty.rooms > 1 ? 's' : ''} · ${selectedProperty.surface} m²</p>
              <p>${selectedProperty.location.city}</p>
            </div>
          </div>
        `;

        popupRef.current
          .setLngLat(selectedProperty.location.coordinates)
          .setHTML(popupContent)
          .addTo(map.current);
      }
    }
  }, [selectedProperty]);

  return (
    <div className="relative w-full h-full max-h-screen">
      <div ref={mapContainer} className="absolute inset-0" />
      {properties.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 rounded-lg">
          <p className="text-gray-600">Aucun bien à afficher</p>
        </div>
      )}
      {/* Adding CSS for the popup styling directly */}
      <style>
        {`
          .property-popup .mapboxgl-popup-content {
            padding: 0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
    </div>
  );
};

export default PropertyMap;
