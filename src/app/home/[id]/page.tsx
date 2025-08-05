import React from 'react';

function Page({ params }: { params: { id: string } }) {
  return (
    <div className={'text-foreground w-full h-full'}>
      <h1>Hello from Notes Page</h1>
      <h1>Test params: {params.id}</h1>
    </div>
  );
}

export default Page;
