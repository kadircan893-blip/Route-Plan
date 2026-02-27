import { create } from 'zustand';

const useAppStore = create((set) => ({
  // Konum Bilgileri
  locationData: null,
  setLocationData: (data) => set({ locationData: data }),

  // Seçilen Kategoriler
  selectedCategories: [],
  setSelectedCategories: (categories) => set({ selectedCategories: categories }),

  // Kategori Alt Filtreleri (keyword)
  categoryKeywords: {},
  setCategoryKeywords: (keywords) => set({ categoryKeywords: keywords }),
  addCategory: (categoryId) => set((state) => ({
    selectedCategories: [...state.selectedCategories, categoryId],
  })),
  removeCategory: (categoryId) => set((state) => ({
    selectedCategories: state.selectedCategories.filter(id => id !== categoryId),
  })),

  // Google Places'dan Gelen Yerler
  places: {},
  setPlaces: (places) => set({ places }),

  // Koordinatlar
  coordinates: null,
  setCoordinates: (coordinates) => set({ coordinates }),

  // Seçilen Yerler (Kullanıcının rotasına eklediği)
  selectedPlaces: [],
  setSelectedPlaces: (places) => set({ selectedPlaces: places }),
  addPlace: (place) => set((state) => ({
    selectedPlaces: [...state.selectedPlaces, place],
  })),
  removePlace: (placeId) => set((state) => ({
    selectedPlaces: state.selectedPlaces.filter(p => p.id !== placeId),
  })),

  // AI Tavsiyesi
  aiRecommendation: null,
  setAiRecommendation: (recommendation) => set({ aiRecommendation: recommendation }),

  // Loading States
  isLoadingPlaces: false,
  setIsLoadingPlaces: (loading) => set({ isLoadingPlaces: loading }),
  isLoadingAI: false,
  setIsLoadingAI: (loading) => set({ isLoadingAI: loading }),

  // Hata Durumları
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Tüm State'i Sıfırla
  resetAll: () => set({
    locationData: null,
    selectedCategories: [],
    categoryKeywords: {},
    places: {},
    coordinates: null,
    selectedPlaces: [],
    aiRecommendation: null,
    isLoadingPlaces: false,
    isLoadingAI: false,
    error: null,
  }),
}));

export default useAppStore;