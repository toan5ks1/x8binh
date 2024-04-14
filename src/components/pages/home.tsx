import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { DotFilledIcon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import background from '../../../assets/bg/bg-poker.png';
import eventBar from '../../../assets/bg/event-bxh-bar.png';
import { HandCard } from '../card/handcard';
import { MainNav } from '../layout/main-nav';

export const Home: React.FC = () => {
  const [bookmarksChecked, setBookmarksChecked] = useState(true);
  const [urlsChecked, setUrlsChecked] = useState(false);
  const [handType, setHandType] = useState('4');
  const [cards, setCards] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
  ]);
  const [numPlayers, setNumPlayers] = useState(4);

  const distributeCards = () => {
    const playerHands: number[][] = Array.from(
      { length: numPlayers },
      () => []
    );

    cards.forEach((card, index) => {
      const playerIndex = index % numPlayers;
      playerHands[playerIndex].push(card);
    });

    return playerHands;
  };
  const handleChangeHandType = (value: string) => {
    setHandType(value);
    setNumPlayers(Number(value));
  };

  const playerHands = distributeCards();

  return (
    <div className="text-center relative">
      <div className="sticky top-0  w-full flex flex-row justify-between items-center bg-white ">
        <MainNav />
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="IconButton" aria-label="Customise options">
              <HamburgerMenuIcon />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="DropdownMenuContent"
              sideOffset={5}
            >
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
      <div
        style={{
          backgroundImage: `url('${background}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
        }}
        className="py-[20px]"
      >
        <div className="px-[5px] ">
          <div className="bg-[#4298d1] bg-opacity-70 pb-[20px] rounded-[25px] shadow-[4.0px_10.0px_8.0px_rgba(0,0,0,0.38)]">
            <div className="flex flex-row justify-center items-center py-[10px]">
              <div
                className="w-[50%] flex flex-row justify-center items-center"
                style={{
                  backgroundImage: `url('${eventBar}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <span className="font-bold text-[25px] text-white text-shadow uppercase">
                  Game
                </span>
                <p className="font-bold text-[25px] text-shadow uppercase">1</p>
              </div>
            </div>

            <div className="flex flex-row gap-[5px] px-[20px]">
              {playerHands.map((hand, index) => (
                <HandCard key={index} cardProp={hand} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
