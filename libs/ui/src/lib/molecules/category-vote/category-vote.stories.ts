import type { Meta, StoryObj } from '@storybook/angular';
import { BzmCategoryVoteComponent, CategoryVoteOption } from './category-vote.component';

const fourCategories: CategoryVoteOption[] = [
  { id: 'science', name: 'Wetenschap', icon: 'flask', color: '#6C5CE7', votes: 0 },
  { id: 'history', name: 'Geschiedenis', icon: 'scroll', color: '#E17055', votes: 0 },
  { id: 'geography', name: 'Aardrijkskunde', icon: 'globe-hemisphere-west', color: '#00B894', votes: 0 },
  { id: 'music', name: 'Muziek', icon: 'music-notes', color: '#0984E3', votes: 0 },
];

const sixCategories: CategoryVoteOption[] = [
  ...fourCategories,
  { id: 'sports', name: 'Sport', icon: 'soccer-ball', color: '#FDCB6E', votes: 0 },
  { id: 'film', name: 'Film & TV', icon: 'film-strip', color: '#E84393', votes: 0 },
];

const votedCategories: CategoryVoteOption[] = [
  { id: 'science', name: 'Wetenschap', icon: 'flask', color: '#6C5CE7', votes: 5 },
  { id: 'history', name: 'Geschiedenis', icon: 'scroll', color: '#E17055', votes: 3 },
  { id: 'geography', name: 'Aardrijkskunde', icon: 'globe-hemisphere-west', color: '#00B894', votes: 8 },
  { id: 'music', name: 'Muziek', icon: 'music-notes', color: '#0984E3', votes: 2 },
];

const meta: Meta<BzmCategoryVoteComponent> = {
  title: 'Molecules/CategoryVote',
  component: BzmCategoryVoteComponent,
  argTypes: {
    options: { control: 'object' },
    hasVoted: { control: 'boolean' },
    selectedId: { control: 'text' },
    timeRemaining: { control: { type: 'range', min: 0, max: 10, step: 1 } },
    hasExtraWeight: { control: 'boolean' },
    showResults: { control: 'boolean' },
  },
  args: {
    options: fourCategories,
    hasVoted: false,
    selectedId: null,
    timeRemaining: 10,
    hasExtraWeight: false,
    showResults: false,
  },
};

export default meta;
type Story = StoryObj<BzmCategoryVoteComponent>;

export const Voting: Story = {
  args: {
    options: fourCategories,
    hasVoted: false,
    timeRemaining: 8,
  },
};

export const AfterVoting: Story = {
  args: {
    options: fourCategories,
    hasVoted: true,
    selectedId: 'science',
    timeRemaining: 5,
  },
};

export const ShowResults: Story = {
  args: {
    options: votedCategories,
    hasVoted: true,
    selectedId: 'geography',
    showResults: true,
    timeRemaining: 0,
  },
};

export const ExtraWeight: Story = {
  args: {
    options: fourCategories,
    hasVoted: true,
    selectedId: 'history',
    hasExtraWeight: true,
    timeRemaining: 6,
  },
};

export const FourCategories: Story = {
  args: {
    options: fourCategories,
    timeRemaining: 10,
  },
};

export const SixCategories: Story = {
  args: {
    options: sixCategories,
    timeRemaining: 10,
  },
};

export const TimeRunningOut: Story = {
  args: {
    options: fourCategories,
    hasVoted: false,
    timeRemaining: 2,
  },
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; max-width: 520px;">
        <div>
          <h4 style="margin: 0 0 8px; color: #999;">Voting</h4>
          <bzm-category-vote
            [options]="voting"
            [hasVoted]="false"
            [timeRemaining]="8"
          />
        </div>
        <div>
          <h4 style="margin: 0 0 8px; color: #999;">Results</h4>
          <bzm-category-vote
            [options]="results"
            [hasVoted]="true"
            selectedId="geography"
            [showResults]="true"
            [timeRemaining]="0"
          />
        </div>
      </div>
    `,
    moduleMetadata: {
      imports: [BzmCategoryVoteComponent],
    },
    props: {
      voting: fourCategories,
      results: votedCategories,
    },
  }),
};
