export interface Mission {
  id: string;
  title: string;
  subtitle: string;
  targetInfraId?: string;
  targetAction?: 'inspect' | 'flood_zone' | 'satellite_mode' | 'quiz';
  xpReward: number;
  badgeName: string;
  badgeIcon: string;
  question?: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface PlayerStats {
  xp: number;
  level: number;
  levelTitle: string;
  discoveredIds: string[];
  completedMissionIds: string[];
  badges: string[];
}
