import type { Meta, StoryObj } from '@storybook/angular';
import { BzmHostPowerUpFeedComponent, type PowerUpFeedItem } from './host-power-up-feed.component';

const now = Date.now();

const singleItem: PowerUpFeedItem[] = [
  { id: '1', playerName: 'Bart', powerUpName: 'Scramble', powerUpIcon: 'shuffle', type: 'chaos', timestamp: now },
];

const multipleItems: PowerUpFeedItem[] = [
  { id: '1', playerName: 'Bart', powerUpName: 'Scramble', powerUpIcon: 'shuffle', type: 'chaos', timestamp: now },
  { id: '2', playerName: 'Lisa', powerUpName: 'Shield', powerUpIcon: 'shield', type: 'boost', timestamp: now - 2000 },
  { id: '3', playerName: 'Tom', powerUpName: 'Double Down', powerUpIcon: 'arrow-fat-lines-up', type: 'boost', timestamp: now - 4000 },
];

const fullFeedItems: PowerUpFeedItem[] = [
  { id: '1', playerName: 'Bart', powerUpName: 'Scramble', powerUpIcon: 'shuffle', type: 'chaos', timestamp: now },
  { id: '2', playerName: 'Lisa', powerUpName: 'Shield', powerUpIcon: 'shield', type: 'boost', timestamp: now - 1000 },
  { id: '3', playerName: 'Tom', powerUpName: 'Double Down', powerUpIcon: 'arrow-fat-lines-up', type: 'boost', timestamp: now - 2000 },
  { id: '4', playerName: 'Eva', powerUpName: 'Fog of War', powerUpIcon: 'cloud-fog', type: 'chaos', timestamp: now - 3000 },
  { id: '5', playerName: 'Max', powerUpName: 'Peek', powerUpIcon: 'eye', type: 'boost', timestamp: now - 4000 },
  { id: '6', playerName: 'Sophie', powerUpName: 'Time Crunch', powerUpIcon: 'timer', type: 'chaos', timestamp: now - 5000 },
];

const meta: Meta<BzmHostPowerUpFeedComponent> = {
  title: 'Molecules/HostPowerUpFeed',
  component: BzmHostPowerUpFeedComponent,
  tags: ['autodocs'],
  argTypes: {
    items: { control: 'object' },
    maxVisible: { control: 'number' },
  },
  args: {
    items: [],
    maxVisible: 4,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 320px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmHostPowerUpFeedComponent>;

export const Empty: Story = {
  args: {
    items: [],
  },
};

export const SingleItem: Story = {
  args: {
    items: singleItem,
  },
};

export const MultipleFeed: Story = {
  args: {
    items: multipleItems,
  },
};

export const FullFeed: Story = {
  args: {
    items: fullFeedItems,
    maxVisible: 4,
  },
};
