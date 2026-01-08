import { ReactNode } from 'react';
import BottomNavigation from './BottomNavigation';

interface AppLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

const AppLayout = ({ children, hideNav = false }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className={`${hideNav ? '' : 'safe-bottom'} min-h-screen`}>
        {children}
      </main>
      {!hideNav && <BottomNavigation />}
    </div>
  );
};

export default AppLayout;
