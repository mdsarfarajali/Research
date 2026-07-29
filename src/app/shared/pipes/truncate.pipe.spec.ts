import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  const pipe = new TruncatePipe();

  it('should create', () => { expect(pipe).toBeTruthy(); });

  it('should truncate long strings', () => {
    const result = pipe.transform('A'.repeat(150), 100);
    expect(result.length).toBe(103); // 100 + '...'
    expect(result.endsWith('...')).toBeTrue();
  });

  it('should not truncate short strings', () => {
    expect(pipe.transform('Hello', 100)).toBe('Hello');
  });

  it('should use custom trail', () => {
    const result = pipe.transform('A'.repeat(150), 100, '…');
    expect(result.endsWith('…')).toBeTrue();
  });
});
