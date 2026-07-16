export const CLUB_MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#141414" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#141414" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8a8070" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#c9b896" }],
  },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#8a8070" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#1a1f1a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2a2a2a" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1f1f1f" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3a3428" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2a2a2a" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0d1118" }] },
];
