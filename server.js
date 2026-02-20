import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const GOOGLE_API_KEY = process.env.VITE_GOOGLE_PLACES_API_KEY;

// Geocoding Endpoint
app.get('/api/geocode', async (req, res) => {
  try {
    const { address } = req.query;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}&language=tr`;
    
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Geocoding hatası' });
  }
});

// Places Nearby Search Endpoint
app.get('/api/places/nearby', async (req, res) => {
  try {
    const { location, radius, type } = req.query;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${GOOGLE_API_KEY}&language=tr`;
    
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Places API hatası' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server çalışıyor: http://localhost:${PORT}`);
});