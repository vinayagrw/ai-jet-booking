import React, { useEffect, useState } from 'react';
import { Jet } from '../types';
import { jetService } from '../services/jetService';

interface JetListProps {
  onJetSelect?: (jet: Jet) => void;
}

export const JetList: React.FC<JetListProps> = ({ onJetSelect }) => {
  const [jets, setJets] = useState<Jet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    passengers: '',
    range: ''
  });

  useEffect(() => {
    loadJets();
  }, []);

  const loadJets = async () => {
    try {
      setLoading(true);
      const data = await jetService.getAllJets();
      setJets(data);
      setError(null);
    } catch (err) {
      setError('Failed to load jets');
      console.error('Error loading jets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const searchParams = {
        category: filters.category || undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        location: filters.location || undefined,
        passengers: filters.passengers ? Number(filters.passengers) : undefined,
        range: filters.range ? Number(filters.range) : undefined
      };
      const data = await jetService.searchJets(searchParams);
      setJets(data);
      setError(null);
    } catch (err) {
      setError('Failed to search jets');
      console.error('Error searching jets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="jet-list">
      <div className="filters">
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="passengers"
          placeholder="Min Passengers"
          value={filters.passengers}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="range"
          placeholder="Min Range (nm)"
          value={filters.range}
          onChange={handleFilterChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="jets-grid">
        {jets.map(jet => (
          <div key={jet.id} className="jet-card" onClick={() => onJetSelect?.(jet)}>
            <img src={jet.image_url || '/placeholder-jet.jpg'} alt={jet.name} />
            <h3>{jet.name}</h3>
            <p>{jet.manufacturer}</p>
            <p>Price: ${jet.price_per_hour}/hour</p>
            <p>Passengers: {jet.max_passengers}</p>
            <p>Range: {jet.range_nm} nm</p>
            <p>Location: {jet.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}; 