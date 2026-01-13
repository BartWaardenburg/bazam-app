import type { Meta, StoryObj } from '@storybook/angular';
import { BzmPinInputComponent } from './pin-input.component';

const meta: Meta<BzmPinInputComponent> = {
  title: 'Atoms/PinInput',
  component: BzmPinInputComponent,
  tags: ['autodocs'],
  argTypes: {
    length: { control: { type: 'number', min: 4, max: 8 } },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    ariaLabel: { control: 'text' },
    autoFocus: { control: 'boolean' },
  },
  args: {
    length: 6,
    disabled: false,
    error: false,
    ariaLabel: 'Voer code in',
    autoFocus: false,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 400px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmPinInputComponent>;

export const Default: Story = {};

export const WithAutoFocus: Story = {
  args: { autoFocus: true },
};

export const ErrorState: Story = {
  args: { error: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const FourDigits: Story = {
  args: { length: 4 },
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
        <div>
          <p style="font-family: var(--bzm-font-family); font-weight: 700; margin: 0 0 8px; color: var(--bzm-color-text);">Normaal</p>
          <bzm-pin-input />
        </div>
        <div>
          <p style="font-family: var(--bzm-font-family); font-weight: 700; margin: 0 0 8px; color: var(--bzm-color-error);">Fout</p>
          <bzm-pin-input [error]="true" />
        </div>
        <div>
          <p style="font-family: var(--bzm-font-family); font-weight: 700; margin: 0 0 8px; color: var(--bzm-color-text-muted);">Uitgeschakeld</p>
          <bzm-pin-input [disabled]="true" />
        </div>
        <div>
          <p style="font-family: var(--bzm-font-family); font-weight: 700; margin: 0 0 8px; color: var(--bzm-color-text);">4 Cijfers</p>
          <bzm-pin-input [length]="4" />
        </div>
      </div>
    `,
    moduleMetadata: {
      imports: [BzmPinInputComponent],
    },
  }),
};
