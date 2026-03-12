import type { Meta, StoryObj } from '@storybook/angular';
import { BzmModeToggleComponent } from './mode-toggle.component';

const meta: Meta<BzmModeToggleComponent> = {
  title: 'Atoms/ModeToggle',
  component: BzmModeToggleComponent,
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['party', 'competitive'],
    },
  },
  args: {
    mode: 'party',
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 480px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmModeToggleComponent>;

export const PartyMode: Story = {
  args: {
    mode: 'party',
  },
};

export const CompetitiveMode: Story = {
  args: {
    mode: 'competitive',
  },
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 480px;">
        <div>
          <p style="margin: 0 0 8px; font-family: var(--bzm-font-family); font-weight: 700; color: var(--bzm-color-text-secondary); font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.1em;">
            Feestmodus geselecteerd
          </p>
          <bzm-mode-toggle mode="party" />
        </div>
        <div>
          <p style="margin: 0 0 8px; font-family: var(--bzm-font-family); font-weight: 700; color: var(--bzm-color-text-secondary); font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.1em;">
            Competitief geselecteerd
          </p>
          <bzm-mode-toggle mode="competitive" />
        </div>
      </div>
    `,
    moduleMetadata: {
      imports: [BzmModeToggleComponent],
    },
  }),
};
