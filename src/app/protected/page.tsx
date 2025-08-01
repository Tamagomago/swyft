import React from 'react';

function TestPage() {
  console.log('protected page');
  return <div className={'text-foreground w-full bg-background'}>Hello from protected page</div>;
}

export default TestPage;
