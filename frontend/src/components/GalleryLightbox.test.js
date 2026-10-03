import { resolveImageUrl, resolveImageTitle, resolveImageCaption } from './GalleryLightbox';

describe('GalleryLightbox helper functions', () => {
  test('resolveImageUrl correctly resolves URLs', () => {
    expect(resolveImageUrl('https://example.com/image.jpg')).toBe('https://example.com/image.jpg');
    expect(resolveImageUrl({ url: 'https://example.com/img2.jpg' })).toBe('https://example.com/img2.jpg');
    expect(resolveImageUrl({ originalUrl: '/uploads/img3.jpg' })).toContain('/uploads/img3.jpg');
    expect(resolveImageUrl(null)).toBe('');
  });

  test('resolveImageTitle extracts title correctly', () => {
    expect(resolveImageTitle({ title: 'Kezelés' })).toBe('Kezelés');
    expect(resolveImageTitle({ cim: 'Kezelés' })).toBe('Kezelés');
    expect(resolveImageTitle(null)).toBe('');
  });

  test('resolveImageCaption extracts caption correctly', () => {
    expect(resolveImageCaption({ caption: 'Részletek' })).toBe('Részletek');
    expect(resolveImageCaption({ description: 'Leírás' })).toBe('Leírás');
    expect(resolveImageCaption(null)).toBe('');
  });
});
