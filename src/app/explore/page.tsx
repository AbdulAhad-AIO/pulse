'use client';

import { Suspense } from 'react';
import ExploreContent from './explore-content';

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-pulse animate-pulse">
          <div className="h-80 bg-gray-200 rounded-lg mb-8"></div>
        </div>
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}
