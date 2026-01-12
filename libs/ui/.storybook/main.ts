import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  staticDirs: ['../src/lib/tokens'],
};

export default config;
