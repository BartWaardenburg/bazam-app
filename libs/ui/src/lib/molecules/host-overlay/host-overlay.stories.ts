import type { Meta, StoryObj } from '@storybook/angular';
import { BzmHostOverlayComponent, OverlayStat } from './host-overlay.component';

const streakStat: OverlayStat = {
  id: 's1',
  message: 'Lisa heeft 5 op rij!',
  icon: 'fire',
  type: 'streak',
};

const nobodyStat: OverlayStat = {
  id: 's2',
  message: 'Niemand had dit goed!',
  icon: 'skull',
  type: 'nobody',
};

const everyoneStat: OverlayStat = {
  id: 's3',
  message: 'Iedereen had het goed!',
  icon: 'confetti',
  type: 'everyone',
};

const highlightStat: OverlayStat = {
  id: 's4',
  message: 'Bart: nieuw persoonlijk record!',
  icon: 'star',
  type: 'highlight',
};

const recordStat: OverlayStat = {
  id: 's5',
  message: 'Nieuw spelrecord: 12.500 pts!',
  icon: 'trophy',
  type: 'record',
};

const meta: Meta<BzmHostOverlayComponent> = {
  title: 'Molecules/HostOverlay',
  component: BzmHostOverlayComponent,
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: { type: 'select' },
      options: ['top-right', 'bottom-left', 'bottom-right'],
    },
    maxVisible: { control: 'number' },
  },
  args: {
    position: 'bottom-left',
    maxVisible: 3,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; padding: 24px; background: #1a1a2e; min-height: 200px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmHostOverlayComponent>;

export const StreakStat: Story = {
  args: {
    stats: [streakStat],
  },
};

export const NobodyStat: Story = {
  args: {
    stats: [nobodyStat],
  },
};

export const EveryoneStat: Story = {
  args: {
    stats: [everyoneStat],
  },
};

export const MultipleStats: Story = {
  args: {
    stats: [streakStat, nobodyStat, everyoneStat],
  },
};

export const TopRight: Story = {
  args: {
    stats: [highlightStat, recordStat],
    position: 'top-right',
  },
};

export const BottomRight: Story = {
  args: {
    stats: [streakStat, everyoneStat, recordStat],
    position: 'bottom-right',
  },
};
