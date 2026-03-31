import { render, screen, fireEvent } from '@testing-library/react';
import Step3MaxDistance from '../components/crawl-setup/Step3MaxDistance';

describe('Step3MaxDistance', () => {
  it('renders input and label', () => {
    render(<Step3MaxDistance value={5} onChange={() => {}} />);
    expect(screen.getByLabelText(/max distance from starting location/i)).toBeInTheDocument();
  });

  it('calls onChange when slider moves', () => {
    const handleChange = jest.fn();
    render(<Step3MaxDistance value={5} onChange={handleChange} />);
    fireEvent.change(screen.getByLabelText(/max distance from starting location/i), { target: { value: '10' } });
    expect(handleChange).toHaveBeenCalledWith(10);
  });
});
