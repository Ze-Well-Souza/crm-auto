import { describe, it, expect } from 'vitest';
import { render } from '@/test/utils/test-utils';
import { Card, CardHeader, CardTitle, CardContent } from '../card';

describe('Card', () => {
  it('renders card with content', () => {
    const { getByText } = render(
      <Card>
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent>Test Content</CardContent>
      </Card>
    );

    expect(getByText('Test Card')).toBeInTheDocument();
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Card className="custom-class">Content</Card>
    );

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('custom-class');
  });
});
