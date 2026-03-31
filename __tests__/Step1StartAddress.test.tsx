import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Step1StartAddress from '../components/crawl-setup/Step1StartAddress';

describe('Step1StartAddress', () => {
  it('renders input and label', () => {
    render(<Step1StartAddress value="" onChange={() => {}} />);
    expect(screen.getByLabelText(/start address/i)).toBeInTheDocument();
  });

  it('shows validation message above input', () => {
    render(<Step1StartAddress value="" onChange={() => {}} error="Please enter a starting address." />);
    expect(screen.getByText(/please enter a starting address/i)).toBeInTheDocument();
  });

  it('calls onChange when typing', () => {
    const handleChange = jest.fn();
    render(<Step1StartAddress value="" onChange={handleChange} />);
    fireEvent.change(screen.getByLabelText(/start address/i), { target: { value: '123' } });
    expect(handleChange).toHaveBeenCalledWith('123');
  });

  it('shows suggestions when typing 3+ chars', async () => {
    render(<Step1StartAddress value="Paddin" onChange={() => {}} />);
    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });
});
