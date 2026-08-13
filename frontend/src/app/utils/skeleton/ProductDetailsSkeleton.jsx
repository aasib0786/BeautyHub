import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProductDetailsSkeleton = () => {
  return (
    <div className="container py-5">
      <div className="row">
        {/* Left: Product Image Skeleton */}
        <div className="col-md-6 mb-4">
          <Skeleton height={400} borderRadius={10} />
          <div className="d-flex mt-3 gap-2">
            <Skeleton height={60} width={60} />
            <Skeleton height={60} width={60} />
            <Skeleton height={60} width={60} />
          </div>
        </div>

        {/* Right: Product Info Skeleton */}
        <div className="col-md-6">
          <Skeleton height={40} width={300} className="mb-3" />
          <Skeleton height={30} width={120} className="mb-2" />
          <Skeleton height={20} width={100} className="mb-4" />

          <Skeleton count={5} className="mb-2" />

          <div className="d-flex gap-3 mt-4">
            <Skeleton height={45} width={150} borderRadius={8} />
            <Skeleton height={45} width={150} borderRadius={8} />
          </div>

          {/* Accordion/Specs */}
          <div className="mt-5">
            <Skeleton height={40} className="mb-2" />
            <Skeleton height={40} className="mb-2" />
            <Skeleton height={40} className="mb-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
