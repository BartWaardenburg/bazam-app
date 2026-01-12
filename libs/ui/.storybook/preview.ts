import type { Preview } from '@storybook/angular';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'app',
      values: [
        { name: 'app', value: '#F5F3FF' },
        { name: 'surface', value: '#FFFFFF' },
        { name: 'primary', value: '#6C5CE7' },
        { name: 'dark', value: '#1A1A2E' },
      ],
    },
  },
};

export default preview;
