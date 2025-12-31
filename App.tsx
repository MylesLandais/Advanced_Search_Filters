import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_ASSETS, DEFAULT_FILTERS } from './constants';
import { FilterState, Asset, AIParseResult } from './types';
import FilterSidebar from './components/FilterSidebar';
import ResultsGrid from './components/ResultsGrid';
import SmartSearch from './components/SmartSearch';
import { LayoutGrid, ListFilter } from 'lucide-react';

const App: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // -- Filtering Logic --
  // Optimized with useMemo to handle the large mock dataset efficiently
  const filteredAssets = useMemo(() => {
    return MOCK_ASSETS.filter(asset => {
      // 1. Text Search (Title, Description, Tags, Source, Entities)
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesText = 
          asset.title.toLowerCase().includes(q) || 
          asset.description.toLowerCase().includes(q) ||
          asset.source.toLowerCase().includes(q) ||
          asset.tags.some(t => t.toLowerCase().includes(q)) ||
          asset.entities.some(e => e.toLowerCase().includes(q));
          
        if (!matchesText) return false;
      }

      // 2. Tags (AND Logic for Selected, NOT Logic for Excluded)
      if (filters.selectedTags.length > 0) {
        const hasAllTags = filters.selectedTags.every(tag => asset.tags.includes(tag));
        if (!hasAllTags) return false;
      }
      if (filters.excludedTags.length > 0) {
        const hasExcludedTag = filters.excludedTags.some(tag => asset.tags.includes(tag));
        if (hasExcludedTag) return false;
      }

      // 3. Entities (OR Logic for Selected, NOT Logic for Excluded)
      if (filters.selectedEntities.length > 0) {
        const hasAnyEntity = filters.selectedEntities.some(entity => asset.entities.includes(entity));
        if (!hasAnyEntity) return false;
      }
      if (filters.excludedEntities.length > 0) {
         const hasExcludedEntity = filters.excludedEntities.some(entity => asset.entities.includes(entity));
         if (hasExcludedEntity) return false;
      }

      // 4. Media Type (OR Logic)
      if (filters.mediaTypes.length > 0) {
        if (!filters.mediaTypes.includes(asset.type)) return false;
      }

      // 5. Source (OR Logic)
      if (filters.selectedSources.length > 0) {
        if (!filters.selectedSources.includes(asset.source)) return false;
      }

      // 6. Ranges
      if (asset.score < filters.scoreRange[0] || asset.score > filters.scoreRange[1]) return false;
      
      // 7. Colors (OR Logic)
      if (filters.selectedColors.length > 0) {
        if (!filters.selectedColors.includes(asset.color)) return false;
      }

      return true;
    });
  }, [filters]);

  // Handle AI Parse Result
  const handleAIParse = (result: AIParseResult) => {
    setFilters(prev => ({
      ...prev,
      searchQuery: result.searchQuery || prev.searchQuery,
      selectedTags: result.tags ? [...new Set([...prev.selectedTags, ...result.tags])] : prev.selectedTags,
      selectedEntities: result.entities ? [...new Set([...prev.selectedEntities, ...result.entities])] : prev.selectedEntities,
      mediaTypes: result.mediaTypes || prev.mediaTypes,
      selectedSources: result.sources || prev.selectedSources,
      scoreRange: [result.minScore ?? prev.scoreRange[0], result.maxScore ?? prev.scoreRange[1]],
    }));
  };

  const hasActiveFilters = 
    filters.selectedTags.length > 0 || 
    filters.excludedTags.length > 0 ||
    filters.selectedEntities.length > 0 || 
    filters.excludedEntities.length > 0 ||
    filters.mediaTypes.length > 0 || 
    filters.selectedSources.length > 0 || 
    filters.searchQuery;

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans">
      
      {/* Top Header / Search Area */}
      <header className="h-20 bg-gray-900 border-b border-gray-800 flex items-center px-6 gap-6 z-20 shadow-md flex-shrink-0">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white mr-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white text-lg">N</span>
            </div>
            Nexus
        </div>
        
        <div className="flex-1 flex justify-center max-w-4xl mx-auto">
            <SmartSearch onParse={handleAIParse} />
        </div>

        <div className="hidden md:flex items-center gap-4">
             <div className="h-8 w-8 rounded-full bg-gray-800 border border-gray-700" />
        </div>
      </header>

      {/* Filter Bar */}
      <FilterSidebar 
          filters={filters} 
          setFilters={setFilters} 
          resultCount={filteredAssets.length}
      />

      {/* Filters Chips (Active State) */}
      {hasActiveFilters && (
          <div className="px-6 py-2 flex flex-wrap gap-2 items-center bg-gray-950/50 border-b border-gray-800/50 min-h-[40px] flex-shrink-0">
              <span className="text-[10px] text-gray-500 uppercase tracking-wide mr-2 font-bold">Active Filters:</span>
              
              {filters.searchQuery && (
                  <Chip label={`"${filters.searchQuery}"`} onRemove={() => setFilters(f => ({...f, searchQuery: ''}))} color="blue" />
              )}
              
              {filters.mediaTypes.map(type => (
                  <Chip key={type} label={type} onRemove={() => setFilters(f => ({...f, mediaTypes: f.mediaTypes.filter(t => t !== type)}))} color="gray" />
              ))}

              {filters.selectedSources.map(source => (
                  <Chip key={source} label={source} onRemove={() => setFilters(f => ({...f, selectedSources: f.selectedSources.filter(s => s !== source)}))} color="emerald" />
              ))}

              {filters.selectedTags.map(tag => (
                  <Chip key={tag} label={`#${tag}`} onRemove={() => setFilters(f => ({...f, selectedTags: f.selectedTags.filter(t => t !== tag)}))} color="green" />
              ))}
              {filters.excludedTags.map(tag => (
                  <Chip key={tag} label={`NOT #${tag}`} onRemove={() => setFilters(f => ({...f, excludedTags: f.excludedTags.filter(t => t !== tag)}))} color="red" />
              ))}

              {filters.selectedEntities.map(entity => (
                  <Chip key={entity} label={`@${entity}`} onRemove={() => setFilters(f => ({...f, selectedEntities: f.selectedEntities.filter(e => e !== entity)}))} color="purple" />
              ))}
              {filters.excludedEntities.map(entity => (
                  <Chip key={entity} label={`NOT @${entity}`} onRemove={() => setFilters(f => ({...f, excludedEntities: f.excludedEntities.filter(e => e !== entity)}))} color="red" />
              ))}
          </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <ResultsGrid assets={filteredAssets} />
      </div>
    </div>
  );
};

interface ChipProps {
  label: string;
  onRemove: () => void;
  color: 'blue' | 'green' | 'purple' | 'gray' | 'emerald' | 'red';
}

const Chip: React.FC<ChipProps> = ({ label, onRemove, color }) => {
    const colors = {
        blue: 'bg-blue-900/30 text-blue-200 border-blue-800',
        green: 'bg-green-900/30 text-green-200 border-green-800',
        purple: 'bg-purple-900/30 text-purple-200 border-purple-800',
        gray: 'bg-gray-800 text-gray-300 border-gray-700',
        emerald: 'bg-emerald-900/30 text-emerald-200 border-emerald-800',
        red: 'bg-red-900/30 text-red-200 border-red-800'
    };

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${colors[color]} animate-fadeIn`}>
            {label}
            <button onClick={onRemove} className="hover:bg-black/20 rounded p-0.5 ml-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
        </span>
    );
}

export default App;