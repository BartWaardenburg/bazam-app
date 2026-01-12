import type { Meta, StoryObj } from '@storybook/angular';
import { BzmCardComponent } from './card.component';

const meta: Meta<BzmCardComponent> = {
  title: 'Atoms/Card',
  component: BzmCardComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'elevated'],
    },
    borderColor: { control: 'color' },
    interactive: { control: 'boolean' },
    ariaLabel: { control: 'text' },
  },
  args: {
    variant: 'default',
    interactive: false,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 400px; }`],
    }),
  ],
  render: (args) => ({
    props: args,
    template: `
      <bzm-card [variant]="variant" [borderColor]="borderColor" [interactive]="interactive" [ariaLabel]="ariaLabel">
        <h3 style="margin: 0 0 0.5rem; font-family: var(--bzm-font-family); font-weight: 800;">Quiz Titel</h3>
        <p style="margin: 0; font-family: var(--bzm-font-family); color: var(--bzm-color-text-secondary);">Dit is de inhoud van een kaart component.</p>
      </bzm-card>
    `,
  }),
};

export default meta;
type Story = StoryObj<BzmCardComponent>;

export const Default: Story = {};

export const Outlined: Story = {
  args: { variant: 'outlined' },
};

export const Elevated: Story = {
  args: { variant: 'elevated' },
};

export const Interactive: Story = {
  args: { interactive: true },
  render: (args) => ({
    props: args,
    template: `
      <bzm-card [variant]="variant" [interactive]="interactive" ariaLabel="Klik om te openen">
        <h3 style="margin: 0 0 0.5rem; font-family: var(--bzm-font-family); font-weight: 800;">Klikbare Kaart</h3>
        <p style="margin: 0; font-family: var(--bzm-font-family); color: var(--bzm-color-text-secondary);">Hover over mij voor een animatie!</p>
      </bzm-card>
    `,
  }),
};

export const CustomBorderColor: Story = {
  args: { borderColor: 'var(--bzm-color-primary)' },
  render: (args) => ({
    props: args,
    template: `
      <bzm-card [borderColor]="borderColor">
        <h3 style="margin: 0 0 0.5rem; font-family: var(--bzm-font-family); font-weight: 800; color: var(--bzm-color-primary);">Rode Rand</h3>
        <p style="margin: 0; font-family: var(--bzm-font-family); color: var(--bzm-color-text-secondary);">Kaart met een custom rand kleur.</p>
      </bzm-card>
    `,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <bzm-card>
          <h3 style="margin: 0 0 0.5rem; font-family: var(--bzm-font-family); font-weight: 800;">Default</h3>
          <p style="margin: 0; font-family: var(--bzm-font-family); color: var(--bzm-color-text-secondary);">Standaard kaart met comic shadow.</p>
        </bzm-card>
        <bzm-card variant="outlined">
          <h3 style="margin: 0 0 0.5rem; font-family: var(--bzm-font-family); font-weight: 800;">Outlined</h3>
          <p style="margin: 0; font-family: var(--bzm-font-family); color: var(--bzm-color-text-secondary);">Alleen rand, geen schaduw.</p>
        </bzm-card>
        <bzm-card variant="elevated">
          <h3 style="margin: 0 0 0.5rem; font-family: var(--bzm-font-family); font-weight: 800;">Elevated</h3>
          <p style="margin: 0; font-family: var(--bzm-font-family); color: var(--bzm-color-text-secondary);">Extra grote schaduw.</p>
        </bzm-card>
        <bzm-card [interactive]="true" borderColor="var(--bzm-color-answer-a)">
          <h3 style="margin: 0 0 0.5rem; font-family: var(--bzm-font-family); font-weight: 800;">Interactive + Custom Border</h3>
          <p style="margin: 0; font-family: var(--bzm-font-family); color: var(--bzm-color-text-secondary);">Klikbaar met cyan rand.</p>
        </bzm-card>
      </div>
    `,
    moduleMetadata: {
      imports: [BzmCardComponent],
    },
  }),
};

export const WithRichContent: Story = {
  render: () => ({
    template: `
      <bzm-card ariaLabel="Quiz details">
        <div style="display: flex; flex-direction: column; gap: 12px; font-family: var(--bzm-font-family);">
          <h3 style="margin: 0; font-weight: 800; font-size: 1.25rem;">🌍 Aardrijkskunde Quiz</h3>
          <p style="margin: 0; color: var(--bzm-color-text-secondary);">Test je kennis over hoofdsteden, rivieren en bergen.</p>
          <div style="display: flex; gap: 8px;">
            <span style="background: var(--bzm-cyan-100); color: var(--bzm-cyan-600); padding: 2px 8px; border-radius: 4px; font-size: 0.875rem; font-weight: 700;">15 vragen</span>
            <span style="background: var(--bzm-green-100); color: var(--bzm-green-600); padding: 2px 8px; border-radius: 4px; font-size: 0.875rem; font-weight: 700;">Makkelijk</span>
          </div>
        </div>
      </bzm-card>
    `,
    moduleMetadata: {
      imports: [BzmCardComponent],
    },
  }),
};
