export enum MediaType {
  Image = 'Image',
  Video = 'Video',
  Audio = 'Audio',
  Document = 'Document'
}

export interface Asset {
  id: string;
  title: string;
  description: string;
  url: string; // Placeholder image URL
  type: MediaType;
  tags: string[];
  entities: string[]; // People, Organizations
  source: string; // Origin domain/platform
  score: number; // 0-100 quality score
  year: number;
  duration?: number; // In seconds, for video/audio
  fileSize: number; // In MB
  color: string; // Hex code for dominant color
}

export interface FilterState {
  searchQuery: string;
  selectedTags: string[]; // implicit AND
  excludedTags: string[]; // NOT
  selectedEntities: string[]; // implicit OR
  excludedEntities: string[]; // NOT
  mediaTypes: MediaType[]; // OR
  selectedSources: string[]; // OR
  scoreRange: [number, number];
  yearRange: [number, number];
  selectedColors: string[]; // OR
}

// For Gemini Parsing
export interface AIParseResult {
  searchQuery?: string;
  tags?: string[];
  entities?: string[];
  mediaTypes?: MediaType[];
  sources?: string[];
  minScore?: number;
  maxScore?: number;
  minYear?: number;
  maxYear?: number;
}