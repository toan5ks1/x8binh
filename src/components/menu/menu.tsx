import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { DotFilledIcon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import React, { useState } from 'react';
interface CardProps {
  imageUrl: string;
  altText?: string;
}

const Menu: React.FC<CardProps> = ({}) => {
  const [handType, setHandType] = useState('4');
  const handleChangeHandType = (value: string) => {
    setHandType(value);
  };
  return (
    <div className="sticky top-0  w-full flex flex-row justify-between items-center bg-white ">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="IconButton" aria-label="Customise options">
            <HamburgerMenuIcon />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
            <DropdownMenu.Label className="DropdownMenuLabel">
              Loại bài
            </DropdownMenu.Label>
            <DropdownMenu.RadioGroup
              value={handType}
              onValueChange={(value) => handleChangeHandType(value)}
            >
              <DropdownMenu.RadioItem
                className="DropdownMenuRadioItem"
                value={'2'}
              >
                <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
                  <DotFilledIcon />
                </DropdownMenu.ItemIndicator>
                2 Tay
              </DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem
                className="DropdownMenuRadioItem"
                value={'3'}
              >
                <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
                  <DotFilledIcon />
                </DropdownMenu.ItemIndicator>
                3 tay
              </DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem
                className="DropdownMenuRadioItem"
                value={'4'}
              >
                <DropdownMenu.ItemIndicator className="DropdownMenuItemIndicator">
                  <DotFilledIcon />
                </DropdownMenu.ItemIndicator>
                4 tay
              </DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>

            <DropdownMenu.Arrow className="DropdownMenuArrow" />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};

export default Menu;
