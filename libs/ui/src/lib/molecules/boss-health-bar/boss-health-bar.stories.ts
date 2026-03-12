import type { Meta, StoryObj } from '@storybook/angular';
import { BzmBossHealthBarComponent } from './boss-health-bar.component';

const meta: Meta<BzmBossHealthBarComponent> = {
  title: 'Molecules/BossHealthBar',
  component: BzmBossHealthBarComponent,
  tags: ['autodocs'],
  argTypes: {
    currentHealth: { control: { type: 'number', min: 0, max: 1000 } },
    maxHealth: { control: { type: 'number', min: 1, max: 1000 } },
    bossName: { control: 'text' },
    showPercentage: { control: 'boolean' },
    criticalThreshold: { control: { type: 'number', min: 0, max: 1, step: 0.05 } },
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 500px; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmBossHealthBarComponent>;

export const FullHealth: Story = {
  args: {
    currentHealth: 1000,
    maxHealth: 1000,
    bossName: 'De Baas',
    showPercentage: true,
    criticalThreshold: 0.25,
  },
};

export const HalfHealth: Story = {
  args: {
    currentHealth: 500,
    maxHealth: 1000,
    bossName: 'De Baas',
    showPercentage: true,
    criticalThreshold: 0.25,
  },
};

export const Critical: Story = {
  args: {
    currentHealth: 200,
    maxHealth: 1000,
    bossName: 'De Baas',
    showPercentage: true,
    criticalThreshold: 0.25,
  },
};

export const AlmostDead: Story = {
  args: {
    currentHealth: 30,
    maxHealth: 1000,
    bossName: 'De Baas',
    showPercentage: true,
    criticalThreshold: 0.25,
  },
};

export const CustomBossName: Story = {
  args: {
    currentHealth: 650,
    maxHealth: 1000,
    bossName: 'Professor Puzzel',
    showPercentage: true,
    criticalThreshold: 0.25,
  },
};
