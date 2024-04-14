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
    <div className="bg-gray-800 h-screen flex justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Select game</CardTitle>
          <CardDescription>
            Select your target game to start with
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between space-x-2">
          {gameList.map((item, i) => (
            <Link key={i} to={item.link} className="flex-1">
              <Button className="w-full">{item.name}</Button>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
