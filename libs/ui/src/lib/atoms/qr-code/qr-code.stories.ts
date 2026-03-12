import type { Meta, StoryObj } from '@storybook/angular';
import { BzmQrCodeComponent } from './qr-code.component';

/**
 * Generates a simple placeholder QR-like SVG as a data URL for Storybook demos.
 * This creates a recognizable grid pattern -- not an actual scannable QR code.
 */
const generatePlaceholderQr = (text: string): string => {
  // Simple deterministic hash to generate a grid pattern from the text
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }

  const size = 21;
  const cellSize = 10;
  const totalSize = size * cellSize;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" width="${totalSize}" height="${totalSize}">`;
  svg += `<rect width="${totalSize}" height="${totalSize}" fill="white"/>`;

  // Draw finder patterns (top-left, top-right, bottom-left)
  const drawFinder = (ox: number, oy: number): string => {
    let s = '';
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        if (isBorder || isInner) {
          s += `<rect x="${(ox + c) * cellSize}" y="${(oy + r) * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
        }
      }
    }
    return s;
  };

  svg += drawFinder(0, 0);
  svg += drawFinder(size - 7, 0);
  svg += drawFinder(0, size - 7);

  // Fill data area with hash-derived pattern
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder pattern areas
      if ((r < 8 && c < 8) || (r < 8 && c >= size - 8) || (r >= size - 8 && c < 8)) continue;
      const bit = ((hash >>> ((r * size + c) % 31)) & 1) ^ ((r + c) % 2);
      if (bit) {
        svg += `<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
      }
    }
  }

  svg += '</svg>';
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const PLACEHOLDER_QR = generatePlaceholderQr('https://bazam.app/join/4829');

const meta: Meta<BzmQrCodeComponent> = {
  title: 'Atoms/QrCode',
  component: BzmQrCodeComponent,
  tags: ['autodocs'],
  argTypes: {
    dataUrl: { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    label: { control: 'text' },
  },
  args: {
    dataUrl: PLACEHOLDER_QR,
    size: 'md',
    label: 'Scan om mee te doen',
  },
};

export default meta;
type Story = StoryObj<BzmQrCodeComponent>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: 'sm',
    label: 'Scan om mee te doen',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    label: 'Scan om mee te doen',
  },
};

export const CustomLabel: Story = {
  args: {
    label: 'Join met je telefoon',
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 32px; align-items: flex-start; flex-wrap: wrap;">
        <bzm-qr-code [dataUrl]="qr" size="sm" label="Small (128px)" />
        <bzm-qr-code [dataUrl]="qr" size="md" label="Medium (200px)" />
        <bzm-qr-code [dataUrl]="qr" size="lg" label="Large (280px)" />
      </div>
    `,
    props: {
      qr: PLACEHOLDER_QR,
    },
    moduleMetadata: {
      imports: [BzmQrCodeComponent],
    },
  }),
};
