import type { Meta, StoryObj } from '@storybook/angular';
import { BzmTeamPickerComponent, TeamOption } from './team-picker.component';

const fourTeams: TeamOption[] = [
  { id: 'red', name: 'Rood', color: '#ef4444', icon: 'fire', playerCount: 3 },
  { id: 'blue', name: 'Blauw', color: '#3b82f6', icon: 'drop', playerCount: 2 },
  { id: 'green', name: 'Groen', color: '#22c55e', icon: 'tree', playerCount: 4 },
  { id: 'yellow', name: 'Geel', color: '#eab308', icon: 'sun', playerCount: 1 },
];

const twoTeams: TeamOption[] = [
  { id: 'red', name: 'Rood', color: '#ef4444', icon: 'fire', playerCount: 5 },
  { id: 'blue', name: 'Blauw', color: '#3b82f6', icon: 'drop', playerCount: 4 },
];

const meta: Meta<BzmTeamPickerComponent> = {
  title: 'Molecules/TeamPicker',
  component: BzmTeamPickerComponent,
  tags: ['autodocs'],
  argTypes: {
    selectedTeamId: { control: 'text' },
    maxPerTeam: { control: 'number' },
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 640px; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmTeamPickerComponent>;

export const FourTeams: Story = {
  args: {
    teams: fourTeams,
    selectedTeamId: null,
    maxPerTeam: 0,
  },
};

export const TwoTeams: Story = {
  args: {
    teams: twoTeams,
    selectedTeamId: null,
    maxPerTeam: 0,
  },
};

export const WithSelection: Story = {
  args: {
    teams: fourTeams,
    selectedTeamId: 'blue',
    maxPerTeam: 0,
  },
};

export const TeamFull: Story = {
  args: {
    teams: fourTeams,
    selectedTeamId: null,
    maxPerTeam: 4,
  },
};
