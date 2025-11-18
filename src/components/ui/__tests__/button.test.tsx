import { describe, it, expect, vi } from 'vitest';
import { render } from '@/test/utils/test-utils';
import { Button } from '../button';

describe('Button', () => {
  it('renders button with text', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    const { getByText } = render(<Button onClick={handleClick}>Click me</Button>);
    
    getByText('Click me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes correctly', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    const button = container.querySelector('button');
    expect(button?.className).toContain('destructive');
  });

  it('can be disabled', () => {
    const { getByText } = render(<Button disabled>Disabled</Button>);
    const button = getByText('Disabled');
    expect(button).toBeDisabled();
  });
});
