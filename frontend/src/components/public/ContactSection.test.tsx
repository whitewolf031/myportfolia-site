import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContactSection } from './ContactSection';

// Mock submitContact
vi.mock('../../api/client', () => ({
  submitContact: vi.fn(),
}));

describe('ContactSection Form Validation', () => {
  it('renders all required form fields and labels', () => {
    render(<ContactSection profile={null} />);

    expect(screen.getByLabelText(/Ismingiz/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telegram yoki email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Xabar/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Yuborish/i })).toBeInTheDocument();
  });

  it('validates required fields when submitted empty', async () => {
    render(<ContactSection profile={null} />);

    const submitBtn = screen.getByRole('button', { name: /Yuborish/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Ismingizni kiriting/i)).toBeInTheDocument();
      expect(screen.getByText(/Telegram yoki emailingizni kiriting/i)).toBeInTheDocument();
      expect(screen.getByText(/Xabar matni kamida 10 ta belgidan iborat bo'lishi kerak/i)).toBeInTheDocument();
    });
  });

  it('shows error if message is shorter than 10 characters', async () => {
    render(<ContactSection profile={null} />);

    const nameInput = screen.getByLabelText(/Ismingiz/i);
    const contactInput = screen.getByLabelText(/Telegram yoki email/i);
    const messageInput = screen.getByLabelText(/Xabar/i);
    const submitBtn = screen.getByRole('button', { name: /Yuborish/i });

    fireEvent.change(nameInput, { target: { value: 'Sardor' } });
    fireEvent.change(contactInput, { target: { value: '@sardor' } });
    fireEvent.change(messageInput, { target: { value: 'Salom' } }); // < 10 chars

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Xabar matni kamida 10 ta belgidan iborat bo'lishi kerak/i)).toBeInTheDocument();
    });
  });
});
