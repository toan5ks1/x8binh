import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import backgound from '../../assets/bg/bg-poker.png';
import { useToast } from '../components/toast/use-toast';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';

export const Onboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const fetchHardwareInfo = async () => {
    setLoading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 10;
        }
        clearInterval(interval);
        return 100;
      });
    }, 400);

    try {
      const hardwareInfo = (await window.backend.getHardwareInfo()) as any;
      toast({
        title: `Welcome ${hardwareInfo.hostname} - ${hardwareInfo.cpu.brand}`,
        description: `You are using: ${hardwareInfo.system.model}\n
        Location: ${hardwareInfo.location.ip}, ${hardwareInfo.location.region}`,
      });
      console.log(hardwareInfo);
    } catch (error) {
      console.error('Failed to fetch hardware info:', error);
      toast({ title: 'Error', description: 'Failed to fetch hardware info.' });
    } finally {
      setLoading(false);
      clearInterval(interval);
    }
  };

  useEffect(() => {
    fetchHardwareInfo();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <Progress value={progress} max={100} className="w-[60%]" />
      </div>
    );
  }

  return (
    <div className="w-full h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
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
            <Link to={'/app'} className="flex">
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
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};
