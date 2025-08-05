import React from 'react';
import Button from '@/components/ui/button';

function Controls() {
  return (
    <div className={'w-full flex justify-end gap-2'}>
      <Button className={'w-7 h-7 bg-button-muted text-background'}></Button>
      <Button className={'bg-button-muted text-background'}></Button>
      <Button className={'bg-button-muted text-background'}></Button>
    </div>
  );
}

export default Controls;
