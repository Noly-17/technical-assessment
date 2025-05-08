import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../components/theme-toggle';
import { ThemeProvider } from '../components/theme-provider';

describe('ThemeToggle', () => {
  it('toggles between light and dark mode', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: /toggle theme/i });

    expect(document.documentElement.classList.contains('light')).toBe(true);

    fireEvent.click(button);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    fireEvent.click(button);
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });
});
