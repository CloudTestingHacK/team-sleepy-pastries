import { render, screen, fireEvent } from '@testing-library/react';
import Step2NumberOfStops from '../components/crawl-setup/Step2NumberOfStops';

describe('Step2NumberOfStops', () => {
  it('renders input and label', () => {
    render(<Step2NumberOfStops value={1} onChange={() => {}} />);
    expect(screen.getByLabelText(/number of pastry stops/i)).toBeInTheDocument();
  });

  it('shows validation message above input', () => {
    render(<Step2NumberOfStops value={0} onChange={() => {}} error="Please select at least one stop." />);
    expect(screen.getByText(/please select at least one stop/i)).toBeInTheDocument();
  });

  it('calls onChange when typing', () => {
    const handleChange = jest.fn();
    render(<Step2NumberOfStops value={1} onChange={handleChange} />);
    fireEvent.change(screen.getByLabelText(/number of pastry stops/i), { target: { value: '3' } });
    expect(handleChange).toHaveBeenCalledWith(3);
  });
});
