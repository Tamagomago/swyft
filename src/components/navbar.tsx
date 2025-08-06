import ThemeToggle from './navbar/theme-toggle';
import Link from 'next/link';
import HamburgerToggle from '@/components/navbar/hamburger-toggle';

function Navbar() {
  return (
    <nav
      className={
        'z-1 flex items-center justify-between w-[95%] py-5 px-3 bg-transparent absolute top-0 text-foreground'
      }
    >
      <HamburgerToggle className={'md:hidden'} />
      <Link href={'/home'}>
        <h1 className={'text-ctm-foreground text-2xl font-bold'}>Swyft</h1>
      </Link>
      <ThemeToggle />
    </nav>
  );
}

export default Navbar;
