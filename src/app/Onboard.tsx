import { Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgound from '../../assets/bg/bg-hepler.png';
import { useToast } from '../components/toast/use-toast';
import { Label } from '../components/ui/label';
import { validateLicense } from '../lib/supabase';

export const Onboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [hardwareInfo, setHardwareInfo] = useState<any>();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      process.env.NODE_ENV != 'development' &&
      localStorage.getItem('license-key')
    ) {
      setHardwareInfo(validateLicense(setLoading, toast, navigate));
    }
    if (process.env.NODE_ENV == 'development') {
      navigate('/app');
    }
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <Loader className="w-6.5 h-6.5 animate-spin"></Loader>
        <Label>Loading your license</Label>
      </div>
    );
  }

  return (
    <div className="w-full h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Mau Binh Helper</h1>
            <p className="text-balance text-muted-foreground">
              Your application not active, please active to use
            </p>
          </div>
          <div className="grid gap-4">
            <div className="flex items-center">
              <Label></Label>
              <Link
                to="/active-license"
                className="ml-auto inline-block text-sm underline"
              >
                Active license key
              </Link>
            </div>
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
