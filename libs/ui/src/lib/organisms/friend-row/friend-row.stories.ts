import type { Meta, StoryObj } from '@storybook/angular';
import { BzmFriendRowComponent, FriendEntry } from './friend-row.component';

const sampleFriends: FriendEntry[] = [
  { nickname: 'Sarah', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { nickname: 'Tom', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom' },
  { nickname: 'Luna', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna' },
  { nickname: 'Max', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max' },
  { nickname: 'Zoe', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe' },
  { nickname: 'Leo', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo' },
  { nickname: 'Mia', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia' },
  { nickname: 'Noah', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah' },
  { nickname: 'Lily' },
  { nickname: 'Jake' },
];

const meta: Meta<BzmFriendRowComponent> = {
  title: 'Organisms/FriendRow',
  component: BzmFriendRowComponent,
  decorators: [
    (story) => ({
      ...story(),
      template: `<div style="max-width: 400px;">${story().template ?? '<bzm-friend-row [friends]="friends" [maxVisible]="maxVisible" (seeAllClick)="seeAllClick()" />'}</div>`,
    }),
  ],
  args: {
    friends: sampleFriends,
    maxVisible: 6,
  },
};

export default meta;
type Story = StoryObj<BzmFriendRowComponent>;

export const Default: Story = {};

export const FewFriends: Story = {
  args: {
    friends: sampleFriends.slice(0, 3),
    maxVisible: 6,
  },
};

export const ManyOverflow: Story = {
  args: {
    friends: sampleFriends,
    maxVisible: 4,
  },
};

export const WithoutAvatars: Story = {
  args: {
    friends: [
      { nickname: 'Alice' },
      { nickname: 'Bob' },
      { nickname: 'Charlie' },
      { nickname: 'Diana' },
      { nickname: 'Eve' },
    ],
    maxVisible: 6,
  },
};

export const SingleFriend: Story = {
  args: {
    friends: [{ nickname: 'BestFriend', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BFF' }],
    maxVisible: 6,
  },
};
