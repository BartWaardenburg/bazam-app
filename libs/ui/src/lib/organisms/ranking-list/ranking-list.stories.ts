import type { Meta, StoryObj } from '@storybook/angular';
import { BzmRankingListComponent, RankingEntry } from './ranking-list.component';

const sampleEntries: RankingEntry[] = [
  { rank: 1, nickname: 'QuizKing99', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=King', streak: 12, points: 2450 },
  { rank: 2, nickname: 'BrainStorm', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Brain', streak: 9, points: 2100 },
  { rank: 3, nickname: 'StarPlayer', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Star', streak: 8, points: 1890 },
  { rank: 4, nickname: 'cat23_', streak: 6, points: 1520, isCurrentUser: true },
  { rank: 5, nickname: 'MathWhiz', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Math', streak: 5, points: 1340 },
  { rank: 6, nickname: 'ScienceGuru', streak: 4, points: 1200 },
  { rank: 7, nickname: 'WordNerd', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Word', streak: 3, points: 980 },
  { rank: 8, nickname: 'GeoExplorer', streak: 2, points: 750 },
  { rank: 9, nickname: 'HistoryBuff', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=History', streak: 1, points: 620 },
  { rank: 10, nickname: 'ArtLover', streak: 0, points: 480 },
];

const meta: Meta<BzmRankingListComponent> = {
  title: 'Organisms/RankingList',
  component: BzmRankingListComponent,
  decorators: [
    (story) => ({
      ...story(),
      template: `<div style="max-width: 400px; background: var(--bzm-color-bg, #F5F3FF); padding: 16px; border-radius: 16px;">${story().template ?? '<bzm-ranking-list [entries]="entries" [currentUserNickname]="currentUserNickname" />'}</div>`,
    }),
  ],
  args: {
    entries: sampleEntries,
    currentUserNickname: 'cat23_',
  },
};

export default meta;
type Story = StoryObj<BzmRankingListComponent>;

export const Default: Story = {};

export const ShortList: Story = {
  args: {
    entries: sampleEntries.slice(0, 3),
    currentUserNickname: undefined,
  },
};

export const CurrentUserAtTop: Story = {
  args: {
    entries: [
      { rank: 1, nickname: 'cat23_', streak: 15, points: 3000, isCurrentUser: true },
      ...sampleEntries.slice(1),
    ],
    currentUserNickname: 'cat23_',
  },
};
