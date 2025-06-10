import { CustomPipe } from './custom.pipe';

describe('CustomPipe', () => {
  let pipe: CustomPipe;

  beforeEach(() => {
    pipe = new CustomPipe();
  });

  it('should create an instance of the pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform a string to uppercase and add "User: "', () => {
    const result = pipe.transform('john');
    expect(result).toBe('User: JOHN');
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

  it('should handle strings with spaces and transform correctly', () => {
    const result = pipe.transform(' jane ');
    expect(result).toBe('User:  JANE ');
  });

  it('should transform a string with mixed case to uppercase and prepend "User: "', () => {
    const result = pipe.transform('jOhN dOe');
    expect(result).toBe('User: JOHN DOE');
  });
});


