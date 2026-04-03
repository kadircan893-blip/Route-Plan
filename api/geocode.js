const NOMINATIM_UA = 'drell-app/1.0 (portfolio)';

export default async function handler(req, res) {
  try {
    const { address } = req.query;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&addressdetails=1&accept-language=tr`;
    const response = await fetch(url, { headers: { 'User-Agent': NOMINATIM_UA } });
    const data = await response.json();
    if (!data.length) return res.json({ status: 'ZERO_RESULTS', results: [] });
    const r = data[0];
    res.json({
      status: 'OK',
      results: [{
        formatted_address: r.display_name,
        geometry: { location: { lat: parseFloat(r.lat), lng: parseFloat(r.lon) } },
      }],
    });
  } catch (e) {
    console.error('[Geocode] hata:', e.message);
    res.status(500).json({ error: 'Geocoding hatası' });
  }
}
