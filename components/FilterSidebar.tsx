import React, { useState } from 'react';
import { FilterState, MediaType } from '../types';
import { TAGS, ENTITIES, SOURCES } from '../constants';
import { Check, Search, X, ChevronDown, Filter, Globe, Hash, Users, Film, Minus } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resultCount: number;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, setFilters, resultCount }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [entitySearch, setEntitySearch] = useState('');
  const [tagSearch, setTagSearch] = useState('');

  const closeDropdown = () => setActiveDropdown(null);
  const toggleDropdown = (name: string) => setActiveDropdown(activeDropdown === name ? null : name);

  // -- Handlers --

  const handleMediaTypeToggle = (type: MediaType) => {
    setFilters(prev => {
      const newTypes = prev.mediaTypes.includes(type)
        ? prev.mediaTypes.filter(t => t !== type)
        : [...prev.mediaTypes, type];
      return { ...prev, mediaTypes: newTypes };
    });
  };

  const handleSourceToggle = (source: string) => {
    setFilters(prev => {
      const newSources = prev.selectedSources.includes(source)
        ? prev.selectedSources.filter(s => s !== source)
        : [...prev.selectedSources, source];
      return { ...prev, selectedSources: newSources };
    });
  };

  // Tri-state: Off -> Selected (Include) -> Excluded (Exclude) -> Off
  const handleTagToggle = (tag: string) => {
    setFilters(prev => {
      const isSelected = prev.selectedTags.includes(tag);
      const isExcluded = prev.excludedTags.includes(tag);

      if (isSelected) {
        // Move to Excluded
        return {
          ...prev,
          selectedTags: prev.selectedTags.filter(t => t !== tag),
          excludedTags: [...prev.excludedTags, tag]
        };
      } else if (isExcluded) {
        // Move to Off
        return {
          ...prev,
          excludedTags: prev.excludedTags.filter(t => t !== tag)
        };
      } else {
        // Move to Selected
        return {
          ...prev,
          selectedTags: [...prev.selectedTags, tag]
        };
      }
    });
  };

  const handleEntityToggle = (entity: string) => {
    setFilters(prev => {
      const isSelected = prev.selectedEntities.includes(entity);
      const isExcluded = prev.excludedEntities.includes(entity);

      if (isSelected) {
        // Move to Excluded
        return {
          ...prev,
          selectedEntities: prev.selectedEntities.filter(e => e !== entity),
          excludedEntities: [...prev.excludedEntities, entity]
        };
      } else if (isExcluded) {
        // Move to Off
        return {
          ...prev,
          excludedEntities: prev.excludedEntities.filter(e => e !== entity)
        };
      } else {
        // Move to Selected
        return {
          ...prev,
          selectedEntities: [...prev.selectedEntities, entity]
        };
      }
    });
  };

  const filteredEntities = ENTITIES.filter(e => 
    e.toLowerCase().includes(entitySearch.toLowerCase())
  );

  const filteredTags = TAGS.filter(t =>
    t.toLowerCase().includes(tagSearch.toLowerCase())
  );

  // -- Render Helpers --

  const DropdownButton = ({ label, icon: Icon, count, excludedCount, id, activeColor = 'blue' }: any) => {
    const totalCount = count + (excludedCount || 0);
    return (
      <div className="relative">
        <button
          onClick={() => toggleDropdown(id)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
            totalCount > 0 || activeDropdown === id
              ? `bg-${activeColor}-900/20 border-${activeColor}-700 text-${activeColor}-200`
              : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-750 hover:border-gray-600'
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
          {totalCount > 0 && (
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-${activeColor}-600 text-white`}>
              {totalCount}
            </span>
          )}
          <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === id ? 'rotate-180' : ''}`} />
        </button>

        {activeDropdown === id && (
          <>
            <div className="fixed inset-0 z-40" onClick={closeDropdown} />
            <div className="absolute top-full left-0 mt-2 w-72 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
               {/* Dropdown Content */}
               
               {id === 'media' && (
                  <div className="space-y-1">
                     {Object.values(MediaType).map(type => (
                        <div 
                          key={type} 
                          onClick={() => handleMediaTypeToggle(type)}
                          className="flex items-center justify-between p-2 rounded hover:bg-gray-800 cursor-pointer"
                        >
                           <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded border flex items-center justify-center ${filters.mediaTypes.includes(type) ? 'bg-blue-500 border-blue-500' : 'border-gray-600'}`}>
                                  {filters.mediaTypes.includes(type) && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <span className="text-gray-200">{type}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               )}

               {id === 'source' && (
                  <div className="space-y-1">
                     {SOURCES.map(source => (
                        <div 
                          key={source} 
                          onClick={() => handleSourceToggle(source)}
                          className="flex items-center justify-between p-2 rounded hover:bg-gray-800 cursor-pointer"
                        >
                           <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded border flex items-center justify-center ${filters.selectedSources.includes(source) ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600'}`}>
                                  {filters.selectedSources.includes(source) && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <span className="text-gray-200">{source}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               )}

               {id === 'tags' && (
                  <>
                    <div className="relative mb-2">
                       <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-500" />
                       <input 
                          type="text" 
                          placeholder="Filter tags..."
                          value={tagSearch}
                          onChange={e => setTagSearch(e.target.value)}
                          className="w-full bg-gray-950 border border-gray-700 rounded-lg pl-8 pr-3 py-2 text-sm text-gray-200 focus:border-green-500 focus:outline-none"
                          autoFocus
                       />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 mb-2 px-1">
                       <span>Click once to include</span>
                       <span>Click again to exclude</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {filteredTags.map(tag => {
                            const isSelected = filters.selectedTags.includes(tag);
                            const isExcluded = filters.excludedTags.includes(tag);
                            return (
                              <button
                                key={tag}
                                onClick={() => handleTagToggle(tag)}
                                className={`px-2 py-1.5 rounded text-xs text-left truncate transition-colors flex items-center gap-2 ${
                                    isSelected
                                    ? 'bg-green-900/30 text-green-300 border border-green-800'
                                    : isExcluded 
                                      ? 'bg-red-900/30 text-red-300 border border-red-800'
                                      : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3" />}
                                {isExcluded && <Minus className="w-3 h-3" />}
                                #{tag}
                              </button>
                            );
                        })}
                    </div>
                  </>
               )}

               {id === 'entities' && (
                  <>
                     <div className="relative mb-2">
                       <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-500" />
                       <input 
                          type="text" 
                          placeholder="Search entities..."
                          value={entitySearch}
                          onChange={e => setEntitySearch(e.target.value)}
                          className="w-full bg-gray-950 border border-gray-700 rounded-lg pl-8 pr-3 py-2 text-sm text-gray-200 focus:border-purple-500 focus:outline-none"
                          autoFocus
                       />
                    </div>
                    <div className="space-y-1">
                        {filteredEntities.map(entity => {
                            const isSelected = filters.selectedEntities.includes(entity);
                            const isExcluded = filters.excludedEntities.includes(entity);
                            
                            return (
                            <div 
                              key={entity} 
                              onClick={() => handleEntityToggle(entity)}
                              className="flex items-center justify-between p-2 rounded hover:bg-gray-800 cursor-pointer"
                            >
                               <div className="flex items-center gap-2 overflow-hidden w-full">
                                  <div className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                      isSelected ? 'bg-purple-500 border-purple-500' : 
                                      isExcluded ? 'bg-red-500 border-red-500' : 'border-gray-600'
                                  }`}>
                                      {isSelected && <Check className="w-3 h-3 text-white" />}
                                      {isExcluded && <Minus className="w-3 h-3 text-white" />}
                                  </div>
                                  <span className={`truncate text-sm ${isExcluded ? 'text-red-300 line-through decoration-red-500/50' : 'text-gray-200'}`}>
                                      {entity}
                                  </span>
                               </div>
                            </div>
                        );})}
                    </div>
                  </>
               )}
            </div>
          </>
        )}
      </div>
    );
  }

  const hasFilters = 
    filters.selectedTags.length > 0 || 
    filters.excludedTags.length > 0 ||
    filters.selectedEntities.length > 0 || 
    filters.excludedEntities.length > 0 ||
    filters.mediaTypes.length > 0 || 
    filters.selectedSources.length > 0;

  return (
    <div className="relative z-10 w-full bg-gray-900 border-b border-gray-800 shadow-lg">
       <div className="px-6 py-3 flex flex-wrap items-center gap-3">
          
          <div className="flex items-center gap-2 text-gray-500 mr-2 flex-shrink-0">
             <Filter className="w-4 h-4" />
             <span className="text-sm font-semibold uppercase tracking-wider">Filter By</span>
          </div>

          {/* Filter Groups */}
          <div className="flex flex-wrap items-center gap-3 flex-1">
             <DropdownButton 
                label="Media" 
                icon={Film} 
                count={filters.mediaTypes.length} 
                id="media" 
                activeColor="blue"
             />
             <DropdownButton 
                label="Sources" 
                icon={Globe} 
                count={filters.selectedSources.length} 
                id="source" 
                activeColor="emerald"
             />
             <DropdownButton 
                label="Tags" 
                icon={Hash} 
                count={filters.selectedTags.length}
                excludedCount={filters.excludedTags.length}
                id="tags" 
                activeColor="green"
             />
             <DropdownButton 
                label="Entities" 
                icon={Users} 
                count={filters.selectedEntities.length}
                excludedCount={filters.excludedEntities.length}
                id="entities" 
                activeColor="purple"
             />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 flex-shrink-0 border-l border-gray-800 pl-4 ml-2">
             <div className="text-right">
                <div className="text-sm font-bold text-gray-200">{resultCount}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Results</div>
             </div>
             
             {hasFilters && (
                 <button
                    onClick={() => setFilters(prev => ({
                        ...prev,
                        selectedTags: [],
                        excludedTags: [],
                        selectedEntities: [],
                        excludedEntities: [],
                        mediaTypes: [],
                        selectedSources: [],
                        scoreRange: [0, 100],
                        selectedColors: []
                    }))}
                    className="text-xs text-red-400 hover:text-red-300 hover:underline px-2"
                >
                    Reset
                </button>
             )}
          </div>

       </div>
    </div>
  );
};

export default FilterSidebar;