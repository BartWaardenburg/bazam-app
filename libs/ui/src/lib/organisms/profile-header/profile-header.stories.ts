import type { Meta, StoryObj } from '@storybook/angular';
import { BzmProfileHeaderComponent } from './profile-header.component';

const meta: Meta<BzmProfileHeaderComponent> = {
  title: 'Organisms/ProfileHeader',
  component: BzmProfileHeaderComponent,
  decorators: [
    (story) => ({
      ...story(),
      template: `<div style="max-width: 400px;">${story().template ?? '<bzm-profile-header [name]="name" [username]="username" [avatarUrl]="avatarUrl" (closeClick)="closeClick()" />'}</div>`,
    }),
  ],
  argTypes: {
    name: { control: 'text' },
    username: { control: 'text' },
    avatarUrl: { control: 'text' },
  },
  args: {
    name: 'Sarah Chen',
    username: '@cat23_',
    avatarUrl: undefined,
  },
};

export default meta;
type Story = StoryObj<BzmProfileHeaderComponent>;

export const Default: Story = {};

export const WithAvatar: Story = {
  args: {
    name: 'Sarah Chen',
    username: '@cat23_',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
};

export const LongName: Story = {
  args: {
    name: 'Alexandria Konstantinova',
    username: '@alex_the_great_quiz_master',
  },
};

export const ShortName: Story = {
  args: {
    name: 'Mia',
    username: '@mia',
  },
};
