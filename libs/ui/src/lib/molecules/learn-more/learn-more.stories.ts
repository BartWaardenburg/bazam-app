import type { Meta, StoryObj } from '@storybook/angular';
import { BzmLearnMoreComponent } from './learn-more.component';

const meta: Meta<BzmLearnMoreComponent> = {
  title: 'Molecules/LearnMore',
  component: BzmLearnMoreComponent,
  tags: ['autodocs'],
  argTypes: {
    fact: { control: 'text' },
    correctAnswer: { control: 'text' },
    category: {
      control: { type: 'select' },
      options: ['science', 'nature', 'history', 'geography', 'entertainment', 'sports', 'music', 'art', 'technology', 'food'],
    },
    expanded: { control: 'boolean' },
  },
  args: {
    fact: 'De Eiffeltoren groeit in de zomer tot 15 cm door uitzetting van het metaal.',
    correctAnswer: 'De Eiffeltoren',
    category: 'geography',
    expanded: true,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 480px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmLearnMoreComponent>;

export const Default: Story = {
  args: {
    fact: 'De Eiffeltoren groeit in de zomer tot 15 cm door uitzetting van het metaal.',
    correctAnswer: 'De Eiffeltoren',
    category: 'geography',
    expanded: true,
  },
};

export const Science: Story = {
  args: {
    fact: 'Water kan tegelijk koken en bevriezen bij een druk van precies 611.657 pascal, het zogenaamde triple punt.',
    correctAnswer: 'Het triple punt',
    category: 'science',
    expanded: true,
  },
};

export const Nature: Story = {
  args: {
    fact: 'Een octopus heeft drie harten: twee pompen bloed naar de kieuwen en een derde pompt het door het lichaam.',
    correctAnswer: 'Drie harten',
    category: 'nature',
    expanded: true,
  },
};

export const History: Story = {
  args: {
    fact: 'Cleopatra leefde dichter bij de uitvinding van de iPhone dan bij de bouw van de piramides van Gizeh.',
    correctAnswer: 'Cleopatra',
    category: 'history',
    expanded: true,
  },
};

export const Entertainment: Story = {
  args: {
    fact: 'De film Toy Story (1995) was de eerste volledig computer-geanimeerde speelfilm ooit gemaakt.',
    correctAnswer: 'Toy Story',
    category: 'entertainment',
    expanded: true,
  },
};

export const Music: Story = {
  args: {
    fact: 'Het nummer "Happy Birthday to You" was tot 2015 auteursrechtelijk beschermd en kostte duizenden dollars om te gebruiken in films.',
    correctAnswer: 'Happy Birthday to You',
    category: 'music',
    expanded: true,
  },
};

export const Collapsed: Story = {
  args: {
    fact: 'De Eiffeltoren groeit in de zomer tot 15 cm door uitzetting van het metaal.',
    correctAnswer: 'De Eiffeltoren',
    category: 'geography',
    expanded: false,
  },
};

export const Technology: Story = {
  args: {
    fact: 'Het eerste computervirus heette "Creeper" en werd in 1971 gemaakt als experiment op ARPANET.',
    correctAnswer: 'Creeper',
    category: 'technology',
    expanded: true,
  },
};

export const AllCategories: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 480px;">
        <bzm-learn-more
          fact="Water kan tegelijk koken en bevriezen bij het triple punt."
          correctAnswer="Het triple punt"
          category="science"
          [expanded]="true"
        />
        <bzm-learn-more
          fact="Een octopus heeft drie harten."
          correctAnswer="Drie harten"
          category="nature"
          [expanded]="true"
        />
        <bzm-learn-more
          fact="Cleopatra leefde dichter bij de iPhone dan bij de piramides."
          correctAnswer="Cleopatra"
          category="history"
          [expanded]="true"
        />
        <bzm-learn-more
          fact="De Eiffeltoren groeit in de zomer."
          correctAnswer="De Eiffeltoren"
          category="geography"
          [expanded]="false"
        />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmLearnMoreComponent],
    },
  }),
};
