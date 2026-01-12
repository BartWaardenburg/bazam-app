import type { Meta, StoryObj } from '@storybook/angular';
import { BzmLeaderboardItemComponent } from './leaderboard-item.component';

const meta: Meta<BzmLeaderboardItemComponent> = {
  title: 'Molecules/LeaderboardItem',
  component: BzmLeaderboardItemComponent,
  tags: ['autodocs'],
  argTypes: {
    rank: { control: 'number' },
    nickname: { control: 'text' },
    avatarUrl: { control: 'text' },
    streak: { control: 'number' },
    points: { control: 'number' },
    isCurrentUser: { control: 'boolean' },
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`
        :host { display: block; max-width: 400px; width: 100%; }
      `],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmLeaderboardItemComponent>;

export const Default: Story = {
  args: {
    rank: 4,
    nickname: 'QuizMaster42',
    streak: 5,
    points: 1250,
    isCurrentUser: false,
  },
};

export const FirstPlace: Story = {
  args: {
    rank: 1,
    nickname: 'BrainChamp',
    streak: 12,
    points: 3480,
    isCurrentUser: false,
  },
};

export const SecondPlace: Story = {
  args: {
    rank: 2,
    nickname: 'SmartCookie',
    streak: 8,
    points: 2950,
    isCurrentUser: false,
  },
};

export const ThirdPlace: Story = {
  args: {
    rank: 3,
    nickname: 'QuizWhiz',
    streak: 6,
    points: 2400,
    isCurrentUser: false,
  },
};

export const CurrentUser: Story = {
  args: {
    rank: 5,
    nickname: 'You',
    streak: 3,
    points: 1100,
    isCurrentUser: true,
  },
};

export const NoStreak: Story = {
  args: {
    rank: 7,
    nickname: 'NewPlayer',
    streak: 0,
    points: 150,
    isCurrentUser: false,
  },
};

export const WithAvatar: Story = {
  args: {
    rank: 1,
    nickname: 'BrainChamp',
    avatarUrl: 'https://placehold.co/80x80/6C5CE7/white?text=BC',
    streak: 12,
    points: 3480,
    isCurrentUser: false,
  },
};

export const FullLeaderboard: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px; max-width: 400px;">
        <bzm-leaderboard-item [rank]="1" nickname="BrainChamp" [streak]="12" [points]="3480" />
        <bzm-leaderboard-item [rank]="2" nickname="SmartCookie" [streak]="8" [points]="2950" />
        <bzm-leaderboard-item [rank]="3" nickname="QuizWhiz" [streak]="6" [points]="2400" />
        <bzm-leaderboard-item [rank]="4" nickname="QuizMaster42" [streak]="5" [points]="1250" />
        <bzm-leaderboard-item [rank]="5" nickname="You" [streak]="3" [points]="1100" [isCurrentUser]="true" />
        <bzm-leaderboard-item [rank]="6" nickname="TriviaPro" [streak]="2" [points]="980" />
        <bzm-leaderboard-item [rank]="7" nickname="NewPlayer" [streak]="0" [points]="150" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmLeaderboardItemComponent],
    },
  }),
};
