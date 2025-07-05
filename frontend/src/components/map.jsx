import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";

// Custom Icons (NUR EINMAL)
const storeIcon = new L.Icon({
  iconUrl: "/location.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});
const customerIcon = new L.Icon({
  iconUrl: "/customer-blue-dot.png",
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

export default function StoreCustomerMap({ height = 340 }) {
  const [stores, setStores] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    setError(false);
    Promise.all([
      fetch("http://localhost:8080/api/stores", {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then((res) => {
        if (!res.ok) throw new Error("Fehler beim Laden der Stores");
        return res.json();
      }),
      fetch("http://localhost:8080/api/customers", {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then((res) => {
        if (!res.ok) throw new Error("Fehler beim Laden der Kunden");
        return res.json();
      }),
    ])
      .then(([storesData, customersData]) => {
        setStores(storesData);
        setCustomers(customersData);
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
        console.error(err);
      });
  }, [token]);

  if (loading) return <div className="p-6 text-gray-600">Lade Karte...</div>;
  if (error)
    return (
      <div className="p-6 text-red-600">
        Fehler beim Laden der Daten. Bitte versuche es später erneut.
      </div>
    );

  return (
    <div style={{ width: "100%", height: `${height}px`, borderRadius: "16px", overflow: "hidden", position: "relative" }}>
      <MapContainer
        center={[36.5, -119.5]}
        zoom={5}
        minZoom={3}
        maxZoom={16}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MarkerClusterGroup>
          {customers.map(
            (c) =>
              c.latitude &&
              c.longitude && (
                <Marker
                  key={c.customerID}
                  position={[c.latitude, c.longitude]}
                  icon={customerIcon}
                />
              )
          )}
        </MarkerClusterGroup>
        {stores.map(
          (s) =>
            s.latitude &&
            s.longitude && (
              <Marker
                key={s.storeID}
                position={[s.latitude, s.longitude]}
                icon={storeIcon}
              />
            )
        )}
      </MapContainer>
    </div>
  );
}
