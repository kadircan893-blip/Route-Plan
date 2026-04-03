export default async function handler(req, res) {
  try {
    const { origin, destination, mode } = req.query;
    const [olat, olng] = origin.split(',');
    const [dlat, dlng] = destination.split(',');
    const profile = mode === 'walking' ? 'foot' : 'driving';
    const url = `https://router.project-osrm.org/route/v1/${profile}/${olng},${olat};${dlng},${dlat}?overview=full&geometries=polyline`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.code !== 'Ok' || !data.routes?.[0]) return res.json({ status: 'ZERO_RESULTS' });
    res.json({ status: 'OK', routes: [{ overview_polyline: { points: data.routes[0].geometry } }] });
  } catch (e) {
    console.error('[Directions] hata:', e.message);
    res.status(500).json({ error: 'Directions hatası' });
  }
}
