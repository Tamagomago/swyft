import React from 'react';

function SkeletonList({ count = 5 }) {
  const fixedWidths = [
    'w-[90%]',
    'w-[72%]',
    'w-[100%]',
    'w-[80%]',
    'w-[60%]',
    'w-[94%]',
    'w-[45%]',
  ];

  return (
    <div>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`rounded h-5 mb-3 ${
            fixedWidths[index % fixedWidths.length]
          } bg-skeleton-background/50 animate-pulse`}
        ></div>
      ))}
    </div>
  );
}

export default SkeletonList;
