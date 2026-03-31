import React from 'react';
import { NextPageContext } from 'next';

interface ErrorProps {
  statusCode?: number;
}

function Error({ statusCode }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cream text-brown-900 p-8">
      <h1 className="text-5xl font-bold mb-4">{statusCode ? `Error ${statusCode}` : 'An error occurred'}</h1>
      <p
        className="text-lg mb-6"
        role="alert"
        aria-live="assertive"
        tabIndex={-1}
      >
        {statusCode ? `A pastry mishap! (Error ${statusCode})` : 'Something went a-rye. Please try again.'}
      </p>
      <p className="text-brown-700 italic">We dough not know what happened, but we’re on a roll to fix it!</p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
