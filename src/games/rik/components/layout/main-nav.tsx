import {
  Hand,
  LogIn,
  LogOut,
  PlusCircle,
  ScreenShareOff,
  Unplug,
} from 'lucide-react';
import { useContext } from 'react';
import { Button } from '../../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../components/ui/dropdown-menu';
import { AppContext } from '../../../../renderer/providers/app';

export function MainNav(
  loginBot1: () => void,
  handleCreateRoomBot1: () => void,
  handleLeaveRoomBot1: () => void,
  handleConnectMauBinhBot1: () => void,
  loginBot2: () => void,
  handleLeaveRoomBot2: () => void,
  handleConnectMauBinhBot2: () => void
) {
  const { state } = useContext<any>(AppContext);
  const onLogin = async () => {
    loginBot1();
    loginBot2();
  };

  const onJoinMauBinh = async () => {
    handleConnectMauBinhBot1();
    handleConnectMauBinhBot2();
  };

  const onCreatRoom = () => {
    handleCreateRoomBot1();
  };

  const onLeaveRoom = () => {
    handleLeaveRoomBot1();
    handleLeaveRoomBot2();
  };

  const onMainJoin = () => {
    window.electron.ipcRenderer.executeScript([
      `__require('GamePlayManager').default.getInstance().joinRoom(${state.firstRoomId},0,'',true);`,
    ]);
  };
  return (
    <div className="flex items-center">
      <div className="ml-auto flex items-center gap-2">
        <div className="h-8 gap-1 flex flex-row justify-center items-center">
          {/* <Gamepad className="h-3.5 w-3.5" /> */}
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Room: {state.firstRoomId}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Hand className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Card deck
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Card deck</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>1</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>2</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>3</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={onLogin} size="sm" className="h-8 gap-1">
          <LogIn className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Login
          </span>
        </Button>
        <Button onClick={onJoinMauBinh} size="sm" className="h-8 gap-1">
          <Unplug className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Connect ChinesePK
          </span>
        </Button>
        <Button onClick={onCreatRoom} size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Create And Join
          </span>
        </Button>
        <Button onClick={onLeaveRoom} size="sm" className="h-8 gap-1">
          <LogOut className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Quit
          </span>
        </Button>
        <Button size="sm" className="h-8 gap-1">
          <ScreenShareOff className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Disconnect
          </span>
        </Button>
      </div>
    </div>
  );
}
