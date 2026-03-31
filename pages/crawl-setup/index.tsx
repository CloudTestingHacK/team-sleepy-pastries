
import React from 'react';
import Step1StartAddress from '../../components/crawl-setup/Step1StartAddress';
import Step2NumberOfStops from '../../components/crawl-setup/Step2NumberOfStops';
import Step3MaxDistance from '../../components/crawl-setup/Step3MaxDistance';

const TOTAL_STEPS = 3;

export default function CrawlSetup() {
  const [startAddress, setStartAddress] = React.useState('');
  const [numberOfStops, setNumberOfStops] = React.useState(1);
  const [maxDistance, setMaxDistance] = React.useState(5);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [errors, setErrors] = React.useState<string | null>(null);
  const errorRef = React.useRef<HTMLParagraphElement>(null);
  const stepAnnounceRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (stepAnnounceRef.current) {
      stepAnnounceRef.current.textContent = `Step ${currentStep} of ${TOTAL_STEPS}`;
    }
  }, [currentStep]);

  const nextStep = () => {
    setErrors(null);
    if (currentStep === 1 && !startAddress.trim()) {
      setErrors('Please enter a starting address.');
      setTimeout(() => errorRef.current?.focus(), 0);
      return;
    }
    if (currentStep === 2 && numberOfStops < 1) {
      setErrors('Please select at least one stop.');
      setTimeout(() => errorRef.current?.focus(), 0);
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const prevStep = () => {
    setErrors(null);
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const router = require('next/router').useRouter ? require('next/router').useRouter() : null;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <Step1StartAddress value={startAddress} onChange={setStartAddress} error={errors} />
            {errors && (
              <p
                id="startAddress-error"
                className="text-red-600 mt-2"
                role="alert"
                aria-live="assertive"
                tabIndex={-1}
                ref={errorRef}
              >
                {errors}
              </p>
            )}
          </>
        );
      case 2:
        return (
          <>
            <Step2NumberOfStops value={numberOfStops} onChange={setNumberOfStops} error={errors} />
            {errors && (
              <p
                id="numberOfStops-error"
                className="text-red-600 mt-2"
                role="alert"
                aria-live="assertive"
                tabIndex={-1}
                ref={errorRef}
              >
                {errors}
              </p>
            )}
          </>
        );
      case 3:
        return <Step3MaxDistance value={maxDistance} onChange={setMaxDistance} />;
      default:
        return null;
    }
  };

  return (
    <section className="max-w-xl mx-auto bg-white/80 rounded-xl shadow-lg p-8 mt-8">
      <div
        ref={stepAnnounceRef}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />
      <h2 className="text-2xl font-bold mb-6 text-brown-900">Setup Your Pastry Crawl</h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (currentStep < TOTAL_STEPS) {
            nextStep();
          } else {
            // Route to /route-results with state as query params
            if (router && router.push) {
              router.push({
                pathname: '/route-results',
                query: {
                  startAddress,
                  numberOfStops,
                  maxDistance,
                },
              });
            }
          }
        }}
        noValidate
      >
        {renderStep()}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="bg-butter text-brown-900 font-semibold py-2 px-6 rounded-lg shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-brown-400 min-w-[100px] min-h-[44px] disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="submit"
            className="bg-butter text-brown-900 font-semibold py-2 px-6 rounded-lg shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-brown-400 min-w-[100px] min-h-[44px]"
          >
            {currentStep < TOTAL_STEPS ? 'Next' : 'Generate'}
          </button>
        </div>
      </form>
    </section>
  );
}
