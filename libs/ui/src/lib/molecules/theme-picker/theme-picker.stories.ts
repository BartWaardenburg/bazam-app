import type { Meta, StoryObj } from '@storybook/angular';
import { BzmThemePickerComponent, ThemeOption } from './theme-picker.component';

const defaultThemes: ThemeOption[] = [
  {
    id: 'standaard',
    name: 'Standaard',
    primaryColor: '#7c3aed',
    accentColor: '#f59e0b',
    backgroundColor: '#f8f5ff',
    icon: 'palette',
  },
  {
    id: 'pub-quiz',
    name: 'Pub Quiz',
    primaryColor: '#166534',
    accentColor: '#ca8a04',
    backgroundColor: '#1a2e1a',
    icon: 'beer-stein',
  },
  {
    id: 'klas',
    name: 'Klas',
    primaryColor: '#2563eb',
    accentColor: '#f8fafc',
    backgroundColor: '#eff6ff',
    icon: 'chalkboard-teacher',
  },
  {
    id: 'verjaardag',
    name: 'Verjaardagsfeest',
    primaryColor: '#ec4899',
    accentColor: '#f472b6',
    backgroundColor: '#fdf2f8',
    icon: 'cake',
  },
  {
    id: 'kerst',
    name: 'Kerst',
    primaryColor: '#dc2626',
    accentColor: '#16a34a',
    backgroundColor: '#fef2f2',
    icon: 'tree-evergreen',
  },
];

const meta: Meta<BzmThemePickerComponent> = {
  title: 'Molecules/ThemePicker',
  component: BzmThemePickerComponent,
  tags: ['autodocs'],
  argTypes: {
    selectedThemeId: { control: 'text' },
  },
  args: {
    themes: defaultThemes,
    selectedThemeId: null,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 500px; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmThemePickerComponent>;

export const AllThemes: Story = {};

export const WithSelection: Story = {
  args: {
    selectedThemeId: 'standaard',
  },
};

export const TwoThemes: Story = {
  args: {
    themes: defaultThemes.slice(0, 2),
    selectedThemeId: 'pub-quiz',
  },
};

export const ManyThemes: Story = {
  args: {
    themes: [
      ...defaultThemes,
      {
        id: 'halloween',
        name: 'Halloween',
        primaryColor: '#f97316',
        accentColor: '#7c3aed',
        backgroundColor: '#1c1917',
        icon: 'ghost',
      },
      {
        id: 'zomer',
        name: 'Zomer',
        primaryColor: '#0ea5e9',
        accentColor: '#facc15',
        backgroundColor: '#f0f9ff',
        icon: 'sun',
      },
      {
        id: 'sport',
        name: 'Sport',
        primaryColor: '#059669',
        accentColor: '#f59e0b',
        backgroundColor: '#ecfdf5',
        icon: 'soccer-ball',
      },
    ],
    selectedThemeId: 'halloween',
  },
};
