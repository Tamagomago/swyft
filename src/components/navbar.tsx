import ThemeToggle from './theme-toggle';

function Navbar() {
  return (
    <nav
      className={
        'z-1 flex items-center justify-between w-[95%] py-5 px-3 bg-transparent absolute top-0 text-foreground'
      }
    >
      <h1 className={'text-ctm-foreground text-2xl font-bold'}>Swyft</h1>
      <ThemeToggle />
    </nav>
  );
}

export default Navbar;
