import type { Meta, StoryObj } from '@storybook/angular';
import { BzmAchievementCardComponent } from './achievement-card.component';

const meta: Meta<BzmAchievementCardComponent> = {
  title: 'Molecules/AchievementCard',
  component: BzmAchievementCardComponent,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    description: { control: 'text' },
    icon: { control: 'text' },
    category: {
      control: 'select',
      options: ['knowledge', 'teamwork', 'clutch', 'explorer', 'dedication'],
    },
    unlocked: { control: 'boolean' },
    progress: { control: { type: 'range', min: 0, max: 100 } },
    unlockedAt: { control: 'text' },
  },
  args: {
    name: 'Brainiac',
    description: 'Win 10 perfecte games',
    icon: 'brain',
    category: 'knowledge',
    unlocked: false,
    progress: 0,
    unlockedAt: null,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 220px; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmAchievementCardComponent>;

export const Unlocked: Story = {
  args: {
    unlocked: true,
    unlockedAt: '2026-02-14T12:00:00Z',
  },
};

export const Locked: Story = {
  args: {
    unlocked: false,
    progress: 0,
  },
};

export const InProgress: Story = {
  args: {
    unlocked: false,
    progress: 65,
    name: 'Comeback Kid',
    description: 'Win 5 games na achterstand',
    icon: 'arrow-counter-clockwise',
    category: 'clutch',
  },
};

export const KnowledgeCategory: Story = {
  args: {
    name: 'Encyclopedie',
    description: 'Beantwoord 500 vragen correct',
    icon: 'book-open',
    category: 'knowledge',
    unlocked: true,
    unlockedAt: '2026-01-20T10:00:00Z',
  },
};

export const TeamworkCategory: Story = {
  args: {
    name: 'Teamspeler',
    description: 'Win 20 team battles',
    icon: 'users-three',
    category: 'teamwork',
    unlocked: false,
    progress: 40,
  },
};

export const ClutchCategory: Story = {
  args: {
    name: 'Laatste Seconde',
    description: 'Beantwoord 10 vragen in de laatste 2 seconden',
    icon: 'timer',
    category: 'clutch',
    unlocked: true,
    unlockedAt: '2026-03-01T15:30:00Z',
  },
};

export const AllCategories: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <bzm-achievement-card name="Brainiac" description="Win 10 perfecte games" icon="brain" category="knowledge" [unlocked]="true" unlockedAt="2026-01-15T10:00:00Z" />
        <bzm-achievement-card name="Teamspeler" description="Win 20 team battles" icon="users-three" category="teamwork" [progress]="60" />
        <bzm-achievement-card name="Clutch King" description="Win 5 close games" icon="lightning" category="clutch" [unlocked]="true" unlockedAt="2026-02-20T14:00:00Z" />
        <bzm-achievement-card name="Ontdekker" description="Speel 10 categorieën" icon="compass" category="explorer" [progress]="30" />
        <bzm-achievement-card name="Doorzetter" description="Speel 100 games" icon="heart" category="dedication" [progress]="85" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmAchievementCardComponent],
    },
  }),
};
