import type { Meta, StoryObj } from '@storybook/angular';
import { BzmPlayerProfileComponent, type PlayerStats } from './player-profile.component';

const defaultStats: PlayerStats = {
  totalGames: 42,
  wins: 18,
  winRate: 42.9,
  avgScore: 2150,
  bestStreak: 7,
  favoriteMode: 'Klassiek',
};

const meta: Meta<BzmPlayerProfileComponent> = {
  title: 'Organisms/PlayerProfile',
  component: BzmPlayerProfileComponent,
  tags: ['autodocs'],
  argTypes: {
    nickname: { control: 'text' },
    stats: { control: 'object' },
    tier: {
      control: 'select',
      options: ['bronze', 'silver', 'gold', 'diamond', 'champion'],
    },
    achievementCount: { control: 'number' },
    totalAchievements: { control: 'number' },
    memberSince: { control: 'text' },
  },
  args: {
    nickname: 'QuizMeester',
    stats: defaultStats,
    tier: 'gold',
    achievementCount: 15,
    totalAchievements: 30,
    memberSince: 'januari 2025',
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 420px; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmPlayerProfileComponent>;

export const Default: Story = {};

export const NewPlayer: Story = {
  args: {
    nickname: 'NieuweSpeler',
    stats: {
      totalGames: 3,
      wins: 1,
      winRate: 33.3,
      avgScore: 850,
      bestStreak: 2,
      favoriteMode: 'Snelronde',
    },
    tier: 'bronze',
    achievementCount: 1,
    totalAchievements: 30,
    memberSince: 'maart 2026',
  },
};

export const VeteranPlayer: Story = {
  args: {
    nickname: 'BrainChamp',
    stats: {
      totalGames: 500,
      wins: 320,
      winRate: 64,
      avgScore: 3200,
      bestStreak: 24,
      favoriteMode: 'Team Battle',
    },
    tier: 'diamond',
    achievementCount: 27,
    totalAchievements: 30,
    memberSince: 'juni 2024',
  },
};

export const ChampionTier: Story = {
  args: {
    nickname: 'Kampioen',
    stats: {
      totalGames: 1000,
      wins: 780,
      winRate: 78,
      avgScore: 4100,
      bestStreak: 42,
      favoriteMode: 'Klassiek',
    },
    tier: 'champion',
    achievementCount: 30,
    totalAchievements: 30,
    memberSince: 'januari 2024',
  },
};

export const AllStats: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 420px;">
        <bzm-player-profile
          nickname="Brons Speler"
          [stats]="bronzeStats"
          tier="bronze"
          [achievementCount]="3"
          [totalAchievements]="30"
          memberSince="maart 2026"
        />
        <bzm-player-profile
          nickname="Goud Speler"
          [stats]="goldStats"
          tier="gold"
          [achievementCount]="15"
          [totalAchievements]="30"
          memberSince="juni 2025"
        />
      </div>
    `,
    props: {
      bronzeStats: {
        totalGames: 10,
        wins: 3,
        winRate: 30,
        avgScore: 1100,
        bestStreak: 3,
        favoriteMode: 'Klassiek',
      },
      goldStats: {
        totalGames: 150,
        wins: 90,
        winRate: 60,
        avgScore: 2800,
        bestStreak: 12,
        favoriteMode: 'Team Battle',
      },
    },
    moduleMetadata: {
      imports: [BzmPlayerProfileComponent],
    },
  }),
};
