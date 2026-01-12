import type { Meta, StoryObj } from '@storybook/angular';
import { BzmBadgeIconComponent } from './badge-icon.component';

const meta: Meta<BzmBadgeIconComponent> = {
  title: 'Atoms/BadgeIcon',
  component: BzmBadgeIconComponent,
  argTypes: {
    iconUrl: { control: 'text' },
    label: { control: 'text' },
    locked: { control: 'boolean' },
  },
  args: {
    label: 'First Quiz',
    locked: false,
  },
};

export default meta;
type Story = StoryObj<BzmBadgeIconComponent>;

export const Unlocked: Story = {
  args: {
    label: 'First Quiz',
    locked: false,
  },
};

export const Locked: Story = {
  args: {
    label: 'Master',
    locked: true,
  },
};

export const WithCustomIcon: Story = {
  args: {
    label: 'Science Pro',
    locked: false,
    iconUrl: 'https://api.dicebear.com/9.x/icons/svg?seed=badge&icon=star',
  },
};

export const LockedWithIcon: Story = {
  args: {
    label: 'Legend',
    locked: true,
    iconUrl: 'https://api.dicebear.com/9.x/icons/svg?seed=locked&icon=trophy',
  },
};

export const BadgeCollection: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <bzm-badge-icon label="First Quiz" [locked]="false" />
        <bzm-badge-icon label="5 Streak" [locked]="false" />
        <bzm-badge-icon label="Science Pro" [locked]="false" />
        <bzm-badge-icon label="Math Whiz" [locked]="true" />
        <bzm-badge-icon label="Legend" [locked]="true" />
        <bzm-badge-icon label="Champion" [locked]="true" />
      </div>
    `,
  }),
};
