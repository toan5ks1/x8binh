import axios from 'axios';
import { GameProps } from '../renderer/providers/app';

export interface LoginResponseDto {
  avatar?: string;
  deposit_today?: number;
  event_deposit_max?: number;
  fullname?: string;
  is_deposit?: boolean;
  level?: string;
  main_balance?: number;
  session_id?: string;
  token?: string;
  username?: string;
  currentCard?: number[];
  isReconnected?: boolean;
  uid?: string;
}

export interface LoginResponse {
  code: number;
  message: string;
  status: string;
  data: Array<LoginResponseDto>;
}

export interface LoginParams {
  username: string;
  password: string;
  app_id: string;
  os: string;
  device: string;
  browser: string;
  fg: string;
  time: number;
  aff_id: string;
  token: string;
  accountType: string;
}

export const defaultLoginParams = {
  app_id: 'b52.club',
  os: 'OS X',
  device: 'Computer',
  browser: 'chrome',
  fg: '94c4b7799e307a8ad4b6a666bd26bd11',
};

export const getAddNameTagCommand = (main: any) => {
  return `
  var myDiv = document.createElement("div");
  myDiv.id = 'div_id';
  myDiv.innerHTML = '<h3 style="color:#fff;position:fixed;top:0;right:0;z-index:99999;background:#020817;padding:10px;border: solid 1px #1E293B; border-radius: 5px">${main.username} </h3>';
  document.body.appendChild(myDiv);`;
};

export const login = async (
  botInfo: LoginParams,
  loginTokenUrl: string
): Promise<LoginResponse | null> => {
  try {
    const response = await axios.get<LoginResponse>(loginTokenUrl, {
      params: { fg: botInfo.fg, token: botInfo.token },
    });
    return response.data;
  } catch (error) {
    console.error(
      'Login failed:',
      axios.isAxiosError(error) ? error.response?.data : error
    );
    return null;
  }
};

export async function accountLogin(account: any, loginTokenUrl: string) {
  try {
    const res = await login(account, loginTokenUrl);
    return res;
  } catch (err) {
    console.error('Error when calling accountLogin:', err);
    return { error: true, message: 'An error occurred during login.' };
  }
}

export async function openAccounts(
  account: any,
  game: GameProps,
  autoClose: boolean = true
) {
  await window.backend.sendMessage('open-accounts', account, game, autoClose);
}

export function joinRoom(account: any, roomId: number): void {
  window.backend.sendMessage(
    'execute-script',
    account,
    `__require('GamePlayManager').default.getInstance().joinRoom(${roomId},0,'',true);`
  );
}

export function joinRoomWithId(account: any, roomId: number): void {
  window.backend.sendMessage(
    'execute-script',
    account,
    `__require('GamePlayManager').default.getInstance().joinRoomWithGameID(${roomId},0,"",4);`
  );
}

export function loginScript(account: any, loginUI: GameProps['loginUI']) {
  return `
    var myDiv = document.createElement("div");
    myDiv.id = 'div_id';
    myDiv.innerHTML = '<h3 style="color:#fff;position:fixed;top:0;right:0;z-index:99999;background:#020817;padding:10px;border: solid 1px #1E293B; border-radius: 5px">${account.username} </h3>';
    document.body.appendChild(myDiv);

    if(!btnDangnhap){
      var btnDangnhap = cc.find("${loginUI.loginBtnDir}");
      console.log("${loginUI.loginBtnDir}", btnDangnhap)
    }

      if (btnDangnhap) {
        let touchStart = new cc.Touch(0, 0);
        let touchEnd = new cc.Touch(0, 0);
        let touchEventStart = new cc.Event.EventTouch([touchStart], false);
        let touchEventEnd = new cc.Event.EventTouch([touchEnd], false);
        
        touchEventStart.type = cc.Node.EventType.TOUCH_START;
        btnDangnhap.dispatchEvent(touchEventStart);

        touchEventEnd.type = cc.Node.EventType.TOUCH_END;
        btnDangnhap.dispatchEvent(touchEventEnd);
      }
      
      setTimeout(() => {
          let editBoxNodeUserName = cc.find("${loginUI.usernameDir}");
          let editBoxUserName = editBoxNodeUserName.getComponent(cc.EditBox);
          if (editBoxUserName) {
              editBoxUserName.string = "${account.username}";
          } else {
              console.log("Không tìm thấy component cc.EditBox trong node");
          }

          let editBoxNodePass = cc.find("${loginUI.passwordDir}");
          let editBoxPass = editBoxNodePass.getComponent(cc.EditBox);
          if (editBoxPass) {
              editBoxPass.string = "${account.password}";
          } else {
              console.log("Không tìm thấy component cc.EditBox trong node");
          }
          setTimeout(() => {
            let nodeXacNhan = cc.find("${loginUI.confirmBtnDir}").getComponent(cc.Button);
            if (nodeXacNhan) {
                let touchStart = new cc.Touch(0, 0);
                let touchEnd = new cc.Touch(0, 0);
                let touchEventStart = new cc.Event.EventTouch([touchStart], false);
                touchEventStart.type = cc.Node.EventType.TOUCH_START;
                nodeXacNhan.node.dispatchEvent(touchEventStart);

                let touchEventEnd = new cc.Event.EventTouch([touchEnd], false);
                touchEventEnd.type = cc.Node.EventType.TOUCH_END;
                nodeXacNhan.node.dispatchEvent(touchEventEnd);
            }
          }, 500)
      }, 500);
      `;
}

export function fillLoginParam(account: any, loginUI: GameProps['loginUI']) {
  window.backend.sendMessage(
    'execute-script',
    account,
    loginScript(account, loginUI)
  );
}
