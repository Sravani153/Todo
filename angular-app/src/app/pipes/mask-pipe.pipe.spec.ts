import { MaskPipePipe } from './mask-pipe.pipe';

describe('MaskPipePipe', () => {
  let pipe: MaskPipePipe;

  beforeEach(() => {
    pipe = new MaskPipePipe();
  });

  it('should create an instance of the pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('should mask a string with default "*" character', () => {
    const result = pipe.transform('hello');
    expect(result).toBe('*****');
  });

  it('should return an empty string when the input is an empty string', () => {
    const result = pipe.transform('');
    expect(result).toBe('');
  });

  it('should return an empty string when the input is null', () => {
    const result = pipe.transform(null as any);
    expect(result).toBe('');
  });

  it('should return an empty string when the input is undefined', () => {
    const result = pipe.transform(undefined as any);
    expect(result).toBe('');
  });

  it('should mask a string with a custom mask character', () => {
    const result = pipe.transform('hello', '#');
    expect(result).toBe('#####');
  });

  it('should handle a string with spaces correctly', () => {
    const result = pipe.transform('hello world');
    expect(result).toBe('***********');
  });

  it('should handle a custom mask character with spaces correctly', () => {
    const result = pipe.transform('test 123', '#');
    expect(result).toBe('########');
  });

  it('should handle a single character input correctly', () => {
    const result = pipe.transform('a');
    expect(result).toBe('*');
  });

  it('should mask a string with special characters correctly', () => {
    const result = pipe.transform('hello@123');
    expect(result).toBe('*********');
  });
});
