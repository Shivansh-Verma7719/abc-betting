import React from 'react';
import Image from 'next/image';
import BettingForm from '../components/BettingForm';

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with ABC logos */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-8 mb-6">
            <Image
              src="/images/abc-logo.png"
              alt="ABC Logo"
              width={120}
              height={120}
              className="object-contain"
            />
            <div className="hidden sm:block">
              <Image
                src="/images/abc-logo-small.png"
                alt="ABC Logo Small"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
          </div>

          <h1 className="text-4xl font-semibold text-indigo-600 mb-2">
            Sports Betting Platform
          </h1>
          <h2 className="text-2xl md:text-2xl font-bold text-gray-800 mb-4">
            Ashoka Business Club x SEC
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our exciting sports betting platform! Select your favorite sports and teams to get started.
          </p>
        </div>

        {/* Betting Form */}
        <BettingForm />

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>&copy; 2025 Ashoka Business Club. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}