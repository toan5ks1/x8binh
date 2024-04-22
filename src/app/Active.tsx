import { Loader } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgound from '../../assets/bg/bg-hepler.png';
import { useToast } from '../components/toast/use-toast';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { handleActive } from '../lib/supabase';

export const Active = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState('');

  const onActive = async () => {
    if (key) {
      handleActive(key, setLoading, toast, navigate);
    } else {
      toast({ title: 'Error', description: 'Please type a key to active.' });
    }
  };

  return (
    <div className="w-full h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Active key</h1>
            <p className="text-balance text-muted-foreground">
              Enter your key below to active program
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Key</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setKey(e.target.value)
                }
              />
            </div>
            <div className="flex items-center">
              <Label></Label>
              <a href="/" className="ml-auto inline-block text-sm underline">
                Back to Onboard page
              </a>
            </div>

            <Button
              disabled={loading}
              type="submit"
              className="w-full"
              onClick={() => onActive()}
            >
              {loading ? (
                <Loader className="w-3.5 h-3.5 animate-spin"></Loader>
              ) : (
                <Label>Active</Label>
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src={backgound}
          alt="Image"
          className="h-full w-full object-cover dark:brightness-[0.7] dark:grayscale"
        />
      </div>
    </div>
  );
};
