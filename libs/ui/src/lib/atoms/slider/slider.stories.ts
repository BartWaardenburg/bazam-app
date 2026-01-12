import type { Meta, StoryObj } from '@storybook/angular';
import { BzmSliderComponent } from './slider.component';

const meta: Meta<BzmSliderComponent> = {
  title: 'Atoms/Slider',
  component: BzmSliderComponent,
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    value: { control: 'number' },
    label: { control: 'text' },
    suffix: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    min: 0,
    max: 100,
    step: 1,
    value: 50,
    label: '',
    suffix: '',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<BzmSliderComponent>;

export const Default: Story = {
  args: {
    value: 50,
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Volume',
    value: 75,
    suffix: '%',
  },
};

export const TimeLimit: Story = {
  args: {
    label: 'Tijdslimiet',
    min: 5,
    max: 60,
    step: 5,
    value: 20,
    suffix: 's',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled slider',
    value: 30,
    disabled: true,
  },
};

export const SmallRange: Story = {
  args: {
    label: 'Aantal vragen',
    min: 1,
    max: 10,
    step: 1,
    value: 5,
  },
};
