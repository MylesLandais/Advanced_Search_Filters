import { Asset, MediaType } from './types';

// Mock Data Generation
export const TAGS = [
  'nature', 'urban', 'portrait', 'cyberpunk', 'minimalist', 
  'dark', 'sci-fi', 'fantasy', 'abstract', 'texture', 
  'aerial', 'underwater', 'wildlife', 'architecture', 'neon',
  'concert', 'stage', 'crowd', 'vintage', 'fashion'
];

export const ENTITIES = [
  'Taylor Swift', 'Selena Gomez',
  'National Geographic', 'BBC Earth', 'NASA', 'Pixar', 
  'Studio Ghibli', 'Marvel', 'DC Comics', 'Sony', 
  'Canon', 'Nikon', 'Adobe', 'Unreal Engine'
];

export const SOURCES = [
  'Reddit', 'Imageboards', 'Unsplash', 'ArtStation', 'DeviantArt', 'Flickr', 'Instagram'
];

export const COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#ffffff', // White
  '#000000', // Black
];

const generateAssets = (count: number): Asset[] => {
  const assets: Asset[] = [];
  for (let i = 0; i < count; i++) {
    const type = Object.values(MediaType)[Math.floor(Math.random() * 4)];
    const numTags = Math.floor(Math.random() * 4) + 1;
    const itemTags = Array.from({ length: numTags }, () => TAGS[Math.floor(Math.random() * TAGS.length)]);
    // Deduplicate tags
    const uniqueTags = [...new Set(itemTags)];
    
    // Increased probability for entities
    const hasEntity = Math.random() > 0.2;
    const itemEntities: string[] = [];
    
    if (hasEntity) {
      // Force Taylor or Selena occasionally for demo purposes
      if (Math.random() > 0.85) {
        itemEntities.push(Math.random() > 0.5 ? 'Taylor Swift' : 'Selena Gomez');
      } else {
        itemEntities.push(ENTITIES[Math.floor(Math.random() * ENTITIES.length)]);
      }
      
      if (Math.random() > 0.8) {
         const secondEntity = ENTITIES[Math.floor(Math.random() * ENTITIES.length)];
         if (!itemEntities.includes(secondEntity)) {
             itemEntities.push(secondEntity);
         }
      }
    }

    assets.push({
      id: `asset-${i}`,
      title: `Asset ${i + 1} - ${uniqueTags[0]} ${type}`,
      description: `A creative ${type.toLowerCase()} featuring ${uniqueTags.join(', ')} elements.`,
      url: `https://picsum.photos/400/300?random=${i}`,
      type,
      tags: uniqueTags,
      entities: itemEntities,
      source: SOURCES[Math.floor(Math.random() * SOURCES.length)],
      score: Math.floor(Math.random() * 50) + 50, // 50-100
      year: Math.floor(Math.random() * 6) + 2020, // 2020-2025
      duration: type === MediaType.Video || type === MediaType.Audio ? Math.floor(Math.random() * 300) + 10 : undefined,
      fileSize: Math.floor(Math.random() * 100) + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  }
  return assets;
};

export const MOCK_ASSETS = generateAssets(150);

export const DEFAULT_FILTERS = {
  searchQuery: '',
  selectedTags: [],
  excludedTags: [],
  selectedEntities: [],
  excludedEntities: [],
  mediaTypes: [],
  selectedSources: [],
  scoreRange: [0, 100] as [number, number],
  yearRange: [2020, 2025] as [number, number],
  selectedColors: [],
};