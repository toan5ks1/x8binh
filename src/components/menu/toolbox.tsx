import { useContext } from 'react';
import { joinRoom } from '../../lib/login';
import { AppContext } from '../../renderer/providers/app';
import useAccountStore from '../../store/accountStore';
import { Button } from '../ui/button';

const Toolbox = () => {
  const { state, setState } = useContext(AppContext);
  const { accounts } = useAccountStore();
  const mains = accounts['MAIN'];

  const subJoin = () => {
    joinRoom(mains[0], state.targetAt);
  };

  const mainJoin = () => {
    joinRoom(mains[1], state.targetAt);
  };

  return (
    <div className="flex space-x-4 py-4">
      <div className="flex space-x-1">
        <Button size="sm" className="h-8 gap-1" onClick={subJoin}>
          Main1 in
        </Button>
        <Button size="sm" className="h-8 gap-1">
          Main1 out
        </Button>
      </div>
      <div className="flex space-x-1">
        <Button size="sm" className="h-8 gap-1" onClick={mainJoin}>
          Main2 in
        </Button>
        <Button size="sm" className="h-8 gap-1">
          Main2 out
        </Button>
      </div>
    </div>
  );
};

export default Toolbox;
