import type { Meta, StoryObj } from '@storybook/angular';
import { BzmRoomCodeComponent } from './room-code.component';

const meta: Meta<BzmRoomCodeComponent> = {
  title: 'Molecules/RoomCode',
  component: BzmRoomCodeComponent,
  tags: ['autodocs'],
  argTypes: {
    code: { control: 'text' },
    label: { control: 'text' },
  },
  args: {
    code: '482916',
    label: 'Game PIN',
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 400px; padding: 24px; padding-bottom: 32px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmRoomCodeComponent>;

export const Default: Story = {};

export const ShortCode: Story = {
  args: { code: '1234' },
};

export const CustomLabel: Story = {
  args: {
    code: '999888',
    label: 'Room Code',
  },
};

export const AllExamples: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px;">
        <bzm-room-code code="482916" />
        <bzm-room-code code="777000" label="Kamer Code" />
        <bzm-room-code code="123456" label="Voer in" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmRoomCodeComponent],
    },
  }),
};
