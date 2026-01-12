import type { Meta, StoryObj } from '@storybook/angular';
import { BzmChipComponent } from './chip.component';

const meta: Meta<BzmChipComponent> = {
  title: 'Atoms/Chip',
  component: BzmChipComponent,
  argTypes: {
    label: { control: 'text' },
    active: { control: 'boolean' },
    color: { control: 'color' },
  },
  args: {
    label: 'Science',
    active: false,
  },
};

export default meta;
type Story = StoryObj<BzmChipComponent>;

export const Inactive: Story = {
  args: {
    label: 'Science',
    active: false,
  },
};

export const Active: Story = {
  args: {
    label: 'Science',
    active: true,
  },
};

export const ActiveWithCustomColor: Story = {
  args: {
    label: 'Music',
    active: true,
    color: '#6C5CE7',
  },
};

export const CategoryFilters: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <bzm-chip label="All" [active]="true" />
        <bzm-chip label="Science" [active]="false" />
        <bzm-chip label="Math" [active]="false" />
        <bzm-chip label="Music" [active]="false" />
        <bzm-chip label="History" [active]="false" />
      </div>
    `,
  }),
};

export const MultipleActive: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <bzm-chip label="All" [active]="false" />
        <bzm-chip label="Science" [active]="true" />
        <bzm-chip label="Math" [active]="true" />
        <bzm-chip label="Music" [active]="false" />
      </div>
    `,
  }),
};

export const CustomColors: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <bzm-chip label="Science" [active]="true" color="#6C5CE7" />
        <bzm-chip label="Math" [active]="true" color="#2ECC71" />
        <bzm-chip label="Music" [active]="true" color="#E74C3C" />
        <bzm-chip label="History" [active]="true" color="#F9C74F" />
      </div>
    `,
  }),
};
