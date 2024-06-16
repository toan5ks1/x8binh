/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import fs from 'fs';
import path from 'path';
import { URL } from 'url';
const os = require('os');

export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

export const loginScript = (account: any) => {
  return `
    var myDiv = document.createElement("div");
    myDiv.id = 'div_id';
    myDiv.innerHTML = '<h3 style="color:#fff;position:fixed;top:0;right:0;z-index:99999;background:#020817;padding:10px;border: solid 1px #1E293B; border-radius: 5px">${account.username} </h3>';
    document.body.appendChild(myDiv);

    
      if(!btnDangnhap){
        var btnDangnhap = cc.find("Canvas/MainUIParent/NewLobby/Footder/footerBar/PublicLobby/layout/dangNhap");
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
          let pathUserName = "CommonPrefabs/PopupDangNhap/popup/TenDangNhap/Username";
          let editBoxNodeUserName = cc.find(pathUserName);
          console.log('editBoxNodeUserName', editBoxNodeUserName)
          let editBoxUserName = editBoxNodeUserName.getComponent(cc.EditBox);
          if (editBoxUserName) {
              editBoxUserName.string = "${account.username}";
          } else {
              console.log("Không tìm thấy component cc.EditBox trong node");
          }

          let pathPass = "CommonPrefabs/PopupDangNhap/popup/Matkhau/Password";
          let editBoxNodePass = cc.find(pathPass);
          let editBoxPass = editBoxNodePass.getComponent(cc.EditBox);
          if (editBoxPass) {
              editBoxPass.string = "${account.password}";
          } else {
              console.log("Không tìm thấy component cc.EditBox trong node");
          }
          setTimeout(() => {
            let nodeXacNhan = cc.find("CommonPrefabs/PopupDangNhap/popup/BtnOk").getComponent(cc.Button);
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
};

export const joinLobbyScript = `__require('LobbyViewController').default.Instance.onClickIConGame(null,"vgcg_4");`;

export const updateAccount = (account: any) => {
  const filePath = `account/${account.accountType}Account.txt`;
  const newData = `${account.username}|${account.password}|${account.token}|${account.accountType}|${account.isSelected}`;

  const usernamePc = os.userInfo().username;
  let userProfilePath;
  if (process.env.NODE_ENV != 'development') {
    if (os.platform() === 'win32') {
      userProfilePath = path.join(
        'C:/Users',
        usernamePc,
        'AppData/Local/Programs/electron-react-boilerplate/resources',
        filePath
      );
    } else if (os.platform() === 'darwin') {
      userProfilePath = path.join(
        '/Users',
        usernamePc,
        'AppData/Local/Programs/electron-react-boilerplate/resources',
        filePath
      );
    } else {
      userProfilePath = path.join(
        '/home',
        usernamePc,
        'AppData/Local/Programs/electron-react-boilerplate/resources',
        filePath
      );
    }
  } else {
    userProfilePath = filePath;
  }

  fs.readFile(userProfilePath, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      console.log('Error reading file:', err);
      return;
    }
    let lines = data.split('\n').filter((line) => line.trim() !== '');
    const newDataParts = newData.split('|');
    const index = lines.findIndex((line) => {
      const parts = line.split('|');
      return parts[0] === newDataParts[0] && parts[1] === newDataParts[1];
    });

    if (index !== -1) {
      lines[index] = newData;
    } else {
      lines.push(newData);
    }

    const updatedData = lines.join('\n');
    fs.writeFile(userProfilePath, updatedData, { encoding: 'utf-8' }, (err) => {
      if (err) {
        console.log('Error writing file:', err);
        return;
      }
      console.log('File Updated:', newData);
    });
  });
};
