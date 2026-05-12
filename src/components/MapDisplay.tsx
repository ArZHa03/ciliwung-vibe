import React, { useEffect, useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import { Report } from '../lib/store';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export function MapDisplay({ reports }: { reports: Report[] }) {
  if (!hasValidKey) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-xl border border-white/10 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Google Maps API Key Dibutuhkan</h2>
        <p className="text-white/70 text-sm mb-4">Untuk melihat peta persebaran sampah, ikuti langkah berikut:</p>
        <ul className="text-left text-xs space-y-2 text-white/50 bg-black/50 p-4 rounded-lg">
          <li>1. Buka <strong>Settings</strong> (ikon gear, pojok kanan atas)</li>
          <li>2. Pilih <strong>Secrets</strong></li>
          <li>3. Ketik <code>GOOGLE_MAPS_PLATFORM_KEY</code> tekan <strong>Enter</strong></li>
          <li>4. Paste API key dari Google Cloud Console</li>
        </ul>
      </div>
    );
  }

  // Jika belum ada report, center di koordinat dummy. 
  // Jika sudah ada laporan, kita bisa gunakan rata-rata lokasi.
  const center = reports.length > 0 
    ? { 
        lat: reports.reduce((acc, r) => acc + r.latitude, 0) / reports.length, 
        lng: reports.reduce((acc, r) => acc + r.longitude, 0) / reports.length 
      }
    : { lat: -6.200000, lng: 106.816666 }; // Jakarta default

  return (
    <div className="rounded-xl overflow-hidden shadow-lg border border-white/10 h-[400px] relative">
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={center}
          defaultZoom={12}
          mapId="CILIWUNG_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
        >
          {reports.map((report, idx) => (
            <ReportMarker key={report.id || idx} report={report} />
          ))}
          <SMECollectors center={center} />
        </Map>
      </APIProvider>
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md p-3 rounded-lg border border-white/10 text-[10px] font-mono text-white/70 shadow-xl pointer-events-none">
        <div className="font-bold mb-2 text-white/90">LEGENDA PETA</div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-red-500 border border-white"></div>
          <span>Sampah (Critical)</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-orange-500 border border-white"></div>
          <span>Sampah (High)</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-green-500 border border-white"></div>
          <span>Sampah (Low)</span>
        </div>
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
          <div className="w-3 h-3 rounded-full bg-[#8b5cf6] border border-white"></div>
          <span>Pengepul / Bank Sampah</span>
        </div>
      </div>
    </div>
  );
}

function SMECollectors({ center }: { center: google.maps.LatLngLiteral }) {
  const placesLib = useMapsLibrary('places');
  const [places, setPlaces] = useState<google.maps.places.Place[]>([]);

  useEffect(() => {
    if (!placesLib || !center) return;
    placesLib.Place.searchByText({
      textQuery: "Bank Sampah OR Pengepul Rongsok",
      fields: ['id', 'displayName', 'location'],
      locationBias: center,
      maxResultCount: 5,
    }).then(({ places }) => setPlaces(places)).catch(e => console.error(e));
  }, [placesLib, center]);

  return (
    <>
      {places.map(p => (
        <SMECollectorMarker key={p.id} place={p} />
      ))}
    </>
  );
}

const SMECollectorMarker: React.FC<{ place: google.maps.places.Place }> = ({ place }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [open, setOpen] = useState(false);

  return (
    <>
      <AdvancedMarker 
        ref={markerRef} 
        position={place.location!} 
        onClick={() => setOpen(true)}
      >
        <Pin background="#8b5cf6" borderColor="#fff" glyphColor="#fff" />
      </AdvancedMarker>
      {open && (
        <InfoWindow anchor={marker} onCloseClick={() => setOpen(false)} style={{ color: '#000' }}>
          <div className="p-2">
            <strong className="block text-sm mb-1">{place.displayName}</strong>
            <p className="text-xs text-gray-600">Pengepul UMKM</p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

const ReportMarker: React.FC<{ report: Report }> = ({ report }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [open, setOpen] = useState(false);

  // Set warna pin berdasarkan impact
  const getPinColor = (impact: string) => {
    switch(impact) {
      case 'Critical': return '#ef4444'; // red-500
      case 'High': return '#f97316'; // orange-500
      case 'Moderate': return '#eab308'; // yellow-500
      case 'Low': return '#22c55e'; // green-500
      default: return '#3b82f6'; // blue-500
    }
  };

  return (
    <>
      <AdvancedMarker 
        ref={markerRef} 
        position={{ lat: report.latitude, lng: report.longitude }} 
        onClick={() => setOpen(true)}
      >
        <Pin background={getPinColor(report.pollutionImpact)} borderColor="#fff" glyphColor="#fff" />
      </AdvancedMarker>
      {open && (
        <InfoWindow anchor={marker} onCloseClick={() => setOpen(false)} style={{ color: '#000' }}>
          <div className="p-2">
            <strong className="block text-sm mb-1">{report.trashType}</strong>
            <p className="text-xs text-gray-600 mb-1">Impact: {report.pollutionImpact}</p>
            <p className="text-xs text-gray-600">Est: {report.weightEstimateKg} kg</p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
