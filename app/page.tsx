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
            <Image
              src="/images/sec-logo.png"
              alt="SEC Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>

          <h1 className="text-4xl font-semibold text-indigo-600 mb-2">
            Batch Championship Fantasy Tournament
          </h1>
          <h2 className="text-2xl md:text-2xl font-bold text-gray-800 mb-4">
            Ashoka Business Club x SEC
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            <span className="font-semibold text-indigo-700">Pay ₹50 and win up to ₹500!</span> Get 7 out of 10 teams right to earn up to 10X your money in our thrilling fantasy tournament.
          </p>
        </div>

        {/* Betting Form */}
        <BettingForm />

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>&copy; 2025 Shivansh Verma. UG2023.</p>
        </div>
      </div>
    </div>
  );
}