import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  staticDirs: [
    '../src/lib/tokens',
    { from: '../../../node_modules/@phosphor-icons/web/src/duotone', to: '/phosphor-duotone' },
  ],
};

export default config;
