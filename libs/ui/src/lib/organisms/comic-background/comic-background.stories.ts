import type { Meta, StoryObj } from '@storybook/angular';
import { BzmComicBackgroundComponent } from './comic-background.component';

const meta: Meta<BzmComicBackgroundComponent> = {
  title: 'Organisms/ComicBackground',
  component: BzmComicBackgroundComponent,
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      ...story(),
      styles: [`
        :host {
          display: block;
          width: 100%;
          height: 500px;
          position: relative;
          background: var(--bzm-color-bg);
          overflow: hidden;
        }
      `],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmComicBackgroundComponent>;

export const Default: Story = {};

export const WithContent: Story = {
  render: () => ({
    template: `
      <div style="position: relative; width: 100%; height: 500px; background: var(--bzm-color-bg); overflow: hidden;">
        <bzm-comic-background />
        <div style="position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; height: 100%;">
          <h1 style="font-family: var(--bzm-font-family); font-size: 3rem; font-weight: 900; color: var(--bzm-color-text); text-shadow: 3px 3px 0 var(--bzm-color-primary);">
            Content boven de achtergrond
          </h1>
        </div>
      </div>
    `,
    moduleMetadata: {
      imports: [BzmComicBackgroundComponent],
    },
  }),
};
