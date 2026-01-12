import type { Meta, StoryObj } from '@storybook/angular';
import { BzmNotificationBellComponent } from './notification-bell.component';

const meta: Meta<BzmNotificationBellComponent> = {
  title: 'Atoms/NotificationBell',
  component: BzmNotificationBellComponent,
  argTypes: {
    hasNotification: { control: 'boolean' },
    count: { control: 'number' },
  },
  args: {
    hasNotification: false,
  },
};

export default meta;
type Story = StoryObj<BzmNotificationBellComponent>;

export const Default: Story = {
  args: {
    hasNotification: false,
  },
};

export const WithNotificationDot: Story = {
  args: {
    hasNotification: true,
  },
};

export const WithCount: Story = {
  args: {
    hasNotification: true,
    count: 3,
  },
};

export const WithHighCount: Story = {
  args: {
    hasNotification: true,
    count: 42,
  },
};

export const WithOverflowCount: Story = {
  args: {
    hasNotification: true,
    count: 150,
  },
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="text-align: center;">
          <bzm-notification-bell [hasNotification]="false" />
          <div style="font-size: 11px; color: #6E6E80; margin-top: 4px; font-family: Nunito, sans-serif;">None</div>
        </div>
        <div style="text-align: center;">
          <bzm-notification-bell [hasNotification]="true" />
          <div style="font-size: 11px; color: #6E6E80; margin-top: 4px; font-family: Nunito, sans-serif;">Dot</div>
        </div>
        <div style="text-align: center;">
          <bzm-notification-bell [hasNotification]="true" [count]="3" />
          <div style="font-size: 11px; color: #6E6E80; margin-top: 4px; font-family: Nunito, sans-serif;">Count</div>
        </div>
        <div style="text-align: center;">
          <bzm-notification-bell [hasNotification]="true" [count]="150" />
          <div style="font-size: 11px; color: #6E6E80; margin-top: 4px; font-family: Nunito, sans-serif;">99+</div>
        </div>
      </div>
    `,
  }),
};
