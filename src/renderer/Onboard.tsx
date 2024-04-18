import { Link } from 'react-router-dom';
import backgound from '../../assets/bg/bg-poker.png';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const gameList = [
  { name: 'Twith', link: '/game/twith/find-room' },
  { name: 'Rik', link: '/game/rik/app' },
];

export const Onboard = () => {
  return (
    // <div className="bg-gray-800 h-screen flex justify-center items-center px-[120px]">
    //   <Card className="w-full max-w-[400px] px-[40px]">
    //     <CardHeader>
    //       <CardTitle>Select game</CardTitle>
    //       <CardDescription>
    //         Select your target game to start with
    //       </CardDescription>
    //     </CardHeader>
    //     <CardContent className="grid grid-cols-2 gap-[20px]">
    //       {gameList.map((item, i) => (
    //         <Link key={i} to={item.link} className="flex">
    //           <Button className="w-full">{item.name}</Button>
    //         </Link>
    //       ))}
    //     </CardContent>
    //   </Card>
    // </div>
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Link to={'/game/rik/app'} className="flex">
              <Button type="submit" className="w-full">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src={backgound}
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};
