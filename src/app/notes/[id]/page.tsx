import React from 'react';
import Editor from '@/components/editor';

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className={'w-full h-full'}>
      <Editor noteId={id} />
    </div>
  );
}

export default Page;
