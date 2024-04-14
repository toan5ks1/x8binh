import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

const gameList = [
  { name: 'Twith', link: '/game/twith/find-room' },
  { name: 'Rik', link: '/game/rik/find-room' },
];

export const Onboard = () => {
  return (
    <div className="bg-gray-800 h-screen flex justify-center items-center px-[120px]">
      <Card className="w-full max-w-[400px] px-[40px]">
        <CardHeader>
          <CardTitle>Select game</CardTitle>
          <CardDescription>
            Select your target game to start with
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-[20px]">
          {gameList.map((item, i) => (
            <Link key={i} to={item.link} className="flex">
              <Button className="w-full">{item.name}</Button>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
