import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const BannerSkeleton = () => {
  return (
    <div
      className="position-relative w-100"
      style={{
        height: '500px',
        backgroundColor: '#f5f5f5',
        overflow: 'hidden',
      }}
    >
      {/* Background skeleton simulating banner image */}
      <Skeleton
        height="100%"
        width="100%"
        borderRadius={0}
        baseColor="#f5f5f5"
        highlightColor="#e0e0e0"
        style={{ position: 'absolute', top: 0, left: 0 }}
      />

      {/* Left arrow circle */}
      <div
        className="position-absolute d-flex align-items-center justify-content-center"
        style={{
          top: '50%',
          left: '20px',
          transform: 'translateY(-50%)',
          width: '40px',
          height: '40px',
          zIndex: 3,
        }}
      >
        <Skeleton circle width={40} height={40} baseColor="#ffffff" highlightColor="#f0f0f0" />
      </div>

      {/* Right arrow circle */}
      <div
        className="position-absolute d-flex align-items-center justify-content-center"
        style={{
          top: '50%',
          right: '20px',
          transform: 'translateY(-50%)',
          width: '40px',
          height: '40px',
          zIndex: 3,
        }}
      >
        <Skeleton circle width={40} height={40} baseColor="#ffffff" highlightColor="#f0f0f0" />
      </div>

      {/* Centered content */}
      <div
        className="position-absolute text-center w-100"
        style={{
          top: '60%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '0 20px',
          zIndex: 2,
        }}
      >
        <div className="mb-3 mx-auto" style={{ maxWidth: '300px' }}>
          <Skeleton height={30} baseColor="#ffffff" highlightColor="#f0f0f0" />
        </div>
        <div className="mb-4 mx-auto" style={{ maxWidth: '400px' }}>
          <Skeleton height={20} baseColor="#ffffff" highlightColor="#f0f0f0" />
        </div>
        <div className="mx-auto" style={{ maxWidth: '180px' }}>
          <Skeleton height={40} borderRadius={20} baseColor="#ffffff" highlightColor="#f0f0f0" />
        </div>
      </div>
    </div>
  );
};

export default BannerSkeleton;
