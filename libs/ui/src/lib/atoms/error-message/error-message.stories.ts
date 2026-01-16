import type { Meta, StoryObj } from '@storybook/angular';
import { BzmErrorMessageComponent } from './error-message.component';

const meta: Meta<BzmErrorMessageComponent> = {
  title: 'Atoms/ErrorMessage',
  component: BzmErrorMessageComponent,
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 400px; }`],
    }),
  ],
  render: () => ({
    template: `<bzm-error-message>Er is iets misgegaan. Probeer het opnieuw.</bzm-error-message>`,
  }),
};

export default meta;
type Story = StoryObj<BzmErrorMessageComponent>;

export const Default: Story = {};

export const RoomNotFound: Story = {
  render: () => ({
    template: `<bzm-error-message>Kamer niet gevonden. Controleer de code.</bzm-error-message>`,
  }),
};

export const ConnectionError: Story = {
  render: () => ({
    template: `<bzm-error-message>Verbinding mislukt. Controleer je internet.</bzm-error-message>`,
  }),
};

export const ValidationError: Story = {
  render: () => ({
    template: `<bzm-error-message>Vul minimaal 1 vraag in.</bzm-error-message>`,
  }),
};

export const AllExamples: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 400px;">
        <bzm-error-message>Er is iets misgegaan. Probeer het opnieuw.</bzm-error-message>
        <bzm-error-message>Kamer niet gevonden. Controleer de code.</bzm-error-message>
        <bzm-error-message>Naam is al bezet. Kies een andere naam.</bzm-error-message>
      </div>
    `,
    moduleMetadata: {
      imports: [BzmErrorMessageComponent],
    },
  }),
};
