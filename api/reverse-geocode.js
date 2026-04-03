const NOMINATIM_UA = 'drell-app/1.0 (portfolio)';

export default async function handler(req, res) {
  try {
    const { lat, lng } = req.query;
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=tr`;
    const response = await fetch(url, { headers: { 'User-Agent': NOMINATIM_UA } });
    const data = await response.json();
    const addr = data.address || {};
    res.json({
      results: [{
        address_components: [
          { long_name: addr.province || addr.state || addr.city || '', types: ['administrative_area_level_1'] },
          { long_name: addr.city_district || addr.town || addr.municipality || '', types: ['administrative_area_level_2'] },
          { long_name: addr.suburb || addr.neighbourhood || addr.quarter || '', types: ['sublocality_level_1', 'sublocality'] },
          { long_name: addr.neighbourhood || addr.quarter || '', types: ['neighborhood'] },
        ].filter(c => c.long_name),
      }],
    });
  } catch (e) {
    console.error('[ReverseGeocode] hata:', e.message);
    res.status(500).json({ error: 'Konum çözümleme hatası' });
  }
}
