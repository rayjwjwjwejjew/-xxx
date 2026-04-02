export type TileType =
  | 'start'
  | 'event'
  | 'penalty'
  | 'study'
  | 'publicService'
  | 'cafeteria'
  | 'property';

export type PropertyLevel = 'FC' | 'AC';

export type CompetencyColor =
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'gray';

export type PenaltyTier = 'T1' | 'T2' | 'T3';

export interface CompetencyInfo {
  color: CompetencyColor;
  name: string;
  description: string;
}

export interface BoardTile {
  id: string;
  index: number;
  type: TileType;
  name: string;
  description: string;
  points: number;
  competencyColor?: CompetencyColor;
  propertyLevel?: PropertyLevel;
  icon?: string;
}

export interface BoardConfig {
  tiles: BoardTile[];
  size: number;
}

export interface TierPenalty {
  tier: PenaltyTier;
  points: number;
  clearRequirement: number;
}

export interface LevelRange {
  tier: 'A1' | 'A2' | 'A3';
  min: number;
  max: number | null;
}

export interface SpecialTileDefinition {
  type: Exclude<TileType, 'property'>;
  name: string;
  description: string;
  defaultPoints: number;
  icon: string;
}

export interface PaTaskCategory {
  id: string;
  name: string;
  description: string;
}

export interface TileTemplate {
  templateId: string;
  type: TileType;
  name: string;
  description: string;
  points: number;
  icon: string;
  competencyColor?: CompetencyColor;
  propertyLevel?: PropertyLevel;
}
