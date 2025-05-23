export * from './lib/dto.js';

export interface Point { lat: number; lng: number; }

export interface ProcessRequest {
  points: Point[];
}

export interface ProcessResponse {
  centroid: Point;
  bounds: { north: number; south: number; east: number; west: number };
}

