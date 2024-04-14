import * as React from 'react';

import { Link } from 'react-router-dom';

import { Badge } from '../../../../components/ui/badge';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '../../../../components/ui/navigation-menu';
import { cn } from '../../../../lib/utils';

const menuItems = [
  {
    name: 'Home',
    link: '/',
  },
  {
    name: 'Config',
    link: '/game/rik/config',
  },
  {
    name: 'Find Room',
    link: '/game/rik/find-room',
  },
  {
    name: 'On Game',
    link: '/game/rik/on-game',
  },
];

export function MainNav() {
  return (
    <div className="h-min py-1 px-2">
      <div className="flex justify-between items-center">
        <NavigationMenu>
          <NavigationMenuList>
            {menuItems.map((item, i) => (
              <NavigationMenuItem key={i}>
                <Link to={item.link}>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {item.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <Badge>Rik</Badge>
      </div>
    </div>
  );
}
const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
