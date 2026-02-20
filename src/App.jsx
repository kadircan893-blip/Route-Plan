import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CardSelectionPage from './pages/CardSelectionPage';
import RoutePlanPage from './pages/RoutePlanPage';
import useAppStore from './store/appStore';

function App() {
  const navigate = useNavigate();
  const { setLocationData, setSelectedCategories } = useAppStore();

  const handleLocationSubmit = (data) => {
    setLocationData(data);
    navigate('/card-selection');
  };

  const handleCategoriesSubmit = (categories) => {
    setSelectedCategories(categories);
    navigate('/route-plan');
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage onLocationSubmit={handleLocationSubmit} />}
      />
      <Route
        path="/card-selection"
        element={<CardSelectionPage onCategoriesSubmit={handleCategoriesSubmit} />}
      />
      <Route
        path="/route-plan"
        element={<RoutePlanPage />}
      />
    </Routes>
  );
}

export default App;