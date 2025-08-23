'use client';

import ThemeToggle from './theme-toggle';
import Link from 'next/link';
import HamburgerToggle from '@/components/navbar/hamburger-toggle';
import { usePathname } from 'next/navigation';

function Navbar() {
  const pathname = usePathname();
  const isHomeRoute = pathname.startsWith('/home');
  return (
    <nav
      className={
        'z-1 flex items-center justify-between w-[95%] py-5 px-3 bg-transparent absolute top-0 text-foreground'
      }
    >
      {isHomeRoute && <HamburgerToggle className={'lg:hidden'} />}
      <Link href={'/home'}>
        <h1 className={'text-foreground text-2xl font-bold'}>Swyft</h1>
      </Link>
      <ThemeToggle />
    </nav>
  );
}

export default Navbar;
