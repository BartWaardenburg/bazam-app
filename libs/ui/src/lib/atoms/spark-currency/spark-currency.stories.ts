import type { Meta, StoryObj } from '@storybook/angular';
import { BzmSparkCurrencyComponent } from './spark-currency.component';

const meta: Meta<BzmSparkCurrencyComponent> = {
  title: 'Atoms/SparkCurrency',
  component: BzmSparkCurrencyComponent,
  argTypes: {
    amount: { control: 'number' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showIcon: { control: 'boolean' },
    animated: { control: 'boolean' },
  },
  args: {
    amount: 350,
    size: 'md',
    showIcon: true,
    animated: false,
  },
};

export default meta;
type Story = StoryObj<BzmSparkCurrencyComponent>;

export const Default: Story = {
  args: {
    amount: 350,
  },
};

export const Small: Story = {
  args: {
    amount: 50,
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    amount: 1250,
    size: 'lg',
  },
};

export const LargeNumber: Story = {
  args: {
    amount: 12500,
    size: 'md',
  },
};

export const Animated: Story = {
  args: {
    amount: 500,
    size: 'lg',
    animated: true,
  },
};

export const WithoutIcon: Story = {
  args: {
    amount: 200,
    showIcon: false,
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 24px;">
        <bzm-spark-currency [amount]="100" size="sm" />
        <bzm-spark-currency [amount]="350" size="md" />
        <bzm-spark-currency [amount]="1250" size="lg" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmSparkCurrencyComponent],
    },
  }),
};

export const Zero: Story = {
  args: {
    amount: 0,
    size: 'md',
  },
};
