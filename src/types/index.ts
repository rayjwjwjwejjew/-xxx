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
export type PlayerLevel = 'A1' | 'A2' | 'A3';
export type AppMode = 'editor' | 'play';
export type GameStatus = 'setup' | 'idle' | 'rolling' | 'moving' | 'choice' | 'resolving' | 'finished';
export type FeedbackTone = 'neutral' | 'positive' | 'warning' | 'event' | 'info';
export type ChoiceTone = 'event' | 'property' | 'warning' | 'info' | 'positive';

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
  tier: PlayerLevel;
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

export interface PenaltyRecord {
  id: string;
  tier: PenaltyTier;
  remainingClearCount: number;
}

export interface PlayerSetupInput {
  id: string;
  name: string;
  color: string;
}

export interface PlayerState {
  id: string;
  name: string;
  color: string;
  avatar?: string;
  position: number;
  points: number;
  level: PlayerLevel;
  penalties: PenaltyRecord[];
  ownedProperties: string[];
  skipTurns: number;
  inCafeteria: boolean;
}

export interface GameLogEntry {
  id: string;
  text: string;
  tone?: 'neutral' | 'positive' | 'warning';
}

export interface GameActionOption {
  id: string;
  label: string;
  description: string;
  variant?: 'primary' | 'secondary' | 'danger';
  badge?: string;
}

export interface ChoicePresentation {
  tone: ChoiceTone;
  kicker?: string;
  highlight?: string;
  flavor?: string;
  icon?: 'sparkles' | 'shield' | 'flag' | 'book' | 'heart' | 'alert' | 'star';
}

export interface PendingChoice {
  type: 'event' | 'property' | 'info';
  title: string;
  description: string;
  tileIndex?: number;
  options: GameActionOption[];
  presentation?: ChoicePresentation;
}

export interface FloatingFeedback {
  id: string;
  text: string;
  tone: FeedbackTone;
}

export interface GameConfig {
  maxRounds: number;
  passStartBonus: number;
}

export interface GameState {
  mode: AppMode;
  players: PlayerState[];
  currentPlayerIndex: number;
  round: number;
  diceValue: number | null;
  status: GameStatus;
  logs: GameLogEntry[];
  winnerId?: string;
  highlightedTileIndex: number | null;
  pendingChoice: PendingChoice | null;
  pendingTileIndex: number | null;
  lastActionSummary?: string;
  config: GameConfig;
  feedbackBursts: FloatingFeedback[];
}

export interface RoomState {
  roomId: string;
  hostId: string;
  players: PlayerState[];
  status: 'lobby' | 'playing' | 'finished';
}
