import { Home, Dumbbell, Utensils, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Start' },
  { path: '/workout', icon: Dumbbell, label: 'Trening' },
  { path: '/diet', icon: Utensils, label: 'Dieta' },
  { path: '/profile', icon: User, label: 'Profil' },
];

const BottomNavigation = () => {
  const location = useLocation();

  return (
    <nav className="glass-nav z-50">
      <div className="flex items-center justify-around h-20 max-w-md mx-auto px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center gap-1 relative py-2 px-4"
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -inset-2 bg-foreground/10 rounded-2xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  size={24}
                  className={`relative z-10 transition-colors ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                />
              </motion.div>
              <span
                className={`text-xs transition-colors ${
                  isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
