import React, { useState } from 'react';
import { Asset, MediaType } from '../types';
import { Image, Film, Music, FileText, Star, Calendar, Globe } from 'lucide-react';

interface ResultsGridProps {
  assets: Asset[];
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ assets }) => {
  if (assets.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
        <SearchIcon className="w-16 h-16 mb-4 opacity-20" />
        <h3 className="text-xl font-medium mb-2">No results found</h3>
        <p>Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-gray-950">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {assets.map(asset => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  );
};

const AssetCard: React.FC<{ asset: Asset }> = ({ asset }) => {
  const getTypeIcon = (type: MediaType) => {
    switch (type) {
      case MediaType.Video: return <Film className="w-4 h-4" />;
      case MediaType.Audio: return <Music className="w-4 h-4" />;
      case MediaType.Document: return <FileText className="w-4 h-4" />;
      default: return <Image className="w-4 h-4" />;
    }
  };

  return (
    <div className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-all hover:shadow-2xl hover:-translate-y-1">
      {/* Image / Thumbnail */}
      <div className="aspect-video bg-gray-800 relative overflow-hidden">
        <img 
          src={asset.url} 
          alt={asset.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 text-xs font-medium text-white">
          {getTypeIcon(asset.type)}
          <span>{asset.type}</span>
        </div>
        {asset.score >= 90 && (
          <div className="absolute top-2 left-2 bg-yellow-500/90 text-black px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Top Rated
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-gray-100 font-semibold truncate leading-tight group-hover:text-blue-400 transition-colors">{asset.title}</h3>
          <p className="text-gray-500 text-xs mt-1 truncate">{asset.description}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 h-6 overflow-hidden">
          {asset.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
              #{tag}
            </span>
          ))}
          {asset.tags.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 text-gray-500">+{asset.tags.length - 3}</span>
          )}
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-800 text-xs text-gray-500">
          <div className="flex items-center gap-1 text-gray-400" title={`Source: ${asset.source}`}>
            <Globe className="w-3 h-3" />
            <span className="truncate max-w-[80px]">{asset.source}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: asset.color }} />
            <span className="font-mono">Score: {asset.score}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export default ResultsGrid;
