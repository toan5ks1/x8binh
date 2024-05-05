import { createClient } from '@supabase/supabase-js';
import _ from 'lodash';
import { fetchHardwareInfo } from './hardwareInfo';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl as any, supabaseKey as any);

export const handleActive = async (
  key: string,
  setLoading: (loading: boolean) => void,
  toast: (options: { title: string; description: string }) => void,
  navigate: (path: string) => void
): Promise<void> => {
  if (!key) {
    toast({ title: 'Error', description: 'Please type a key to active.' });
    return;
  }
  const hardwareInfo = await fetchHardwareInfo();

  setLoading(true);
  try {
    if (!hardwareInfo) {
      toast({ title: 'Error', description: 'Failed to fetch hardware info.' });
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('license-key')
      .select('*')
      .eq('license_key', key)
      .single();

    if (error) throw new Error('Wrong key or key not exist');

    if (data) {
      if (
        !data.uuid &&
        !data.pc_name &&
        !data.cpu &&
        !data.system &&
        !data.active_at
      ) {
        const { error: updateError } = await supabase
          .from('license-key')
          .update({
            uuid: hardwareInfo.system.uuid,
            pc_name: hardwareInfo.hostname,
            cpu: hardwareInfo.cpu,
            system: hardwareInfo.system,
            active_at: new Date(),
          })
          .eq('license_key', key);

        if (updateError) throw new Error('Could not activate key');

        localStorage.setItem('license-key', key);
        toast({ title: 'Success', description: 'Key has been activated.' });
        navigate('/app');
      } else {
        if (
          _.isEqual(data.uuid, hardwareInfo.system.uuid) &&
          _.isEqual(data.pc_name, hardwareInfo.hostname) &&
          _.isEqual(data.cpu, hardwareInfo.cpu) &&
          _.isEqual(data.system, hardwareInfo.system)
        ) {
          localStorage.setItem('license-key', key);
          navigate('/app');
        } else {
          toast({
            title: 'Error',
            description: 'Error while active license key.',
          });
        }
      }
    } else {
      toast({ title: 'Error', description: 'Key not found.' });
    }
  } catch (error) {
    toast({
      title: 'Error',
      description: 'An error occurred during activation.',
    });
  } finally {
    setLoading(false);
    console.log(hardwareInfo);
    return hardwareInfo;
  }
};

export const validateLicense = async (
  setLoading: (loading: boolean) => void,
  toast: (options: { title: string; description: string }) => void,
  navigate: (path: string) => void
): Promise<void> => {
  setLoading(true);
  const licenseKey = localStorage.getItem('license-key');
  const hardwareInfo = await fetchHardwareInfo();
  if (!licenseKey) {
    toast({ title: 'Error', description: 'No license key found.' });
    navigate('/');
    setLoading(false);
    return hardwareInfo;
  }

  if (!hardwareInfo) {
    toast({ title: 'Error', description: 'Failed to fetch hardware info.' });
    setLoading(false);
    return;
  }

  try {
    const { data, error } = await supabase
      .from('license-key')
      .select('*')
      .eq('license_key', licenseKey)
      .single();

    if (error || !data) {
      toast({ title: 'Error', description: 'License key validation failed.' });
      setLoading(false);
      return hardwareInfo;
    }

    if (
      _.isEqual(data.uuid, hardwareInfo.system.uuid) &&
      _.isEqual(data.pc_name, hardwareInfo.hostname) &&
      _.isEqual(data.cpu, hardwareInfo.cpu) &&
      _.isEqual(data.system, hardwareInfo.system)
    ) {
      navigate('/app');
    } else {
      toast({
        title: 'Error',
        description: 'License key does not match the device.',
      });
    }
  } catch (error) {
    localStorage.removeItem('license-key');
    toast({
      title: 'Error',
      description: 'An error occurred during validation.',
    });
  } finally {
    setLoading(false);
    console.log(hardwareInfo);
    return hardwareInfo;
  }
};
