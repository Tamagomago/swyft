import React from 'react';

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className={'text-foreground w-full h-full'}>
      <h1>Hello from Notes Page</h1>
      <h1>Test params: {id}</h1>
    </div>
  );
}

export default Page;
