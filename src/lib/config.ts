export const roomTypes = [
  100, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000,
];

export const gameList = [
  {
    name: 'B52',
    loginToken: 'https://bfivegwlog.gwtenkges.com/gwms/v1/verifytoken.aspx',
    loginUrl: 'https://bfivegwlog.gwtenkges.com/user/login.aspx',
    connectURL: 'wss://cardbodergs.weskb5gams.net/websocket',
    web: 'https://web.b52.vin',
    info: 'https://bfivegwlog.gwtenkges.com/lobby/info.aspx',
    load: 'https://bfivegwlog.gwtenkges.com/gwms/v1/safe/load.aspx',
    loginUI: {
      loginBtnDir:
        'Canvas/MainUIParent/NewLobby/Footder/footerBar/PublicLobby/layout/dangNhap',
      usernameDir: 'CommonPrefabs/PopupDangNhap/popup/TenDangNhap/Username',
      passwordDir: 'CommonPrefabs/PopupDangNhap/popup/Matkhau/Password',
      confirmBtnDir: 'CommonPrefabs/PopupDangNhap/popup/BtnOk',
    },
  },
  {
    name: 'HIT',
    loginToken: 'https://bodergatez.dsrcgoms.net/gwms/v1/verifytoken.aspx',
    loginUrl: 'https://bodergatez.dsrcgoms.net/user/login.aspx',
    connectURL: 'wss://carkgwaiz.hytsocesk.com/websocket',
    web: 'https://web.hitclub.top/',
    info: 'https://bodergatez.dsrcgoms.net/lobby/info.aspx',
    load: 'https://bodergatez.dsrcgoms.net/gwms/v1/safe/load.aspx',
    loginUI: {
      loginBtnDir: 'Canvas/LoadingNode/listBtn/btnDangNhap',
      usernameDir:
        'Canvas/LoadingNode/PopupDangNhap/popup/NodeInfo/TenDangNhap/Username',
      passwordDir:
        'Canvas/LoadingNode/PopupDangNhap/popup/NodeInfo/Matkhau/Password',
      confirmBtnDir:
        'Canvas/LoadingNode/PopupDangNhap/popup/NodeInfo/nodeBottom/BtnOk',
    },
  },
];
