export const inviteCommand = `
try{
  var btnInvite1 = cc.find("Canvas/MainUI/MauBinhController").children[1];
  var btnInvite2 = cc.find("Canvas/MainUI/MauBinhController").children[2];
  var btnInvite3 = cc.find("Canvas/MainUI/MauBinhController").children[3];
  if (btnInvite1) {
      btnInvite1.active = true;
  }
  if (btnInvite2) {
      btnInvite2.active = true;
  }
  if (btnInvite3) {
      btnInvite3.active = true;
  }
  if (btnInvite1) {
      btnInvite1.on('touchstart', function() {

      });
  }
  if (btnInvite2) {
      btnInvite2.on('touchstart', function() {

      });
  }
if (btnInvite3) {
      btnInvite3.on('touchstart', function() {

      });
  }
  if (btnInvite1) {
      btnInvite1.active = true;
      btnInvite1.opacity = 255;
      btnInvite1.visible = true;
  }
  if (btnInvite2) {
      btnInvite2.active = true;
      btnInvite2.opacity = 255;
      btnInvite2.visible = true;
  }
  if (btnInvite3) {
      btnInvite3.active = true;
      btnInvite3.opacity = 255;
      btnInvite3.visible = true;
  }
  let touchEventStart = new cc.Event.EventTouch([new cc.Touch(0, 0)], false);
  touchEventStart.type = cc.Node.EventType.TOUCH_START;
  btnInvite1.dispatchEvent(touchEventStart);
  btnInvite2.dispatchEvent(touchEventStart);
  btnInvite3.dispatchEvent(touchEventStart);

  let touchEventEnd = new cc.Event.EventTouch([new cc.Touch(0, 0)], false);
  touchEventEnd.type = cc.Node.EventType.TOUCH_END;
  btnInvite1.dispatchEvent(touchEventEnd);
  btnInvite2.dispatchEvent(touchEventEnd);
  btnInvite3.dispatchEvent(touchEventEnd);
}catch{
  if (btnInvite1) {
      btnInvite1.active = true;
  }
  if (btnInvite2) {
      btnInvite2.active = true;
  }
  if (btnInvite3) {
      btnInvite3.active = true;
  }
  if (btnInvite1) {
      btnInvite1.on('touchstart', function() {

      });
  }
  if (btnInvite2) {
      btnInvite2.on('touchstart', function() {

      });
  }
  if (btnInvite3) {
      btnInvite3.on('touchstart', function() {

      });
  }
  if (btnInvite1) {
      btnInvite1.active = true;
      btnInvite1.opacity = 255;
      btnInvite1.visible = true;
  }
  if (btnInvite2) {
      btnInvite2.active = true;
      btnInvite2.opacity = 255;
      btnInvite2.visible = true;
  }
  if (btnInvite3) {
      btnInvite3.active = true;
      btnInvite3.opacity = 255;
      btnInvite3.visible = true;
  }
  let touchEventStart = new cc.Event.EventTouch([new cc.Touch(0, 0)], false);
  touchEventStart.type = cc.Node.EventType.TOUCH_START;
  btnInvite1.dispatchEvent(touchEventStart);
  btnInvite2.dispatchEvent(touchEventStart);
  btnInvite3.dispatchEvent(touchEventStart);

  let touchEventEnd = new cc.Event.EventTouch([new cc.Touch(0, 0)], false);
  touchEventEnd.type = cc.Node.EventType.TOUCH_END;
  btnInvite1.dispatchEvent(touchEventEnd);
  btnInvite2.dispatchEvent(touchEventEnd);
  btnInvite3.dispatchEvent(touchEventEnd);
}
`;

export const arrangeCardCommand = `
      window.sapBaiMinh = async function () {
        try {
          gg = cc
            .find("Canvas")
            .getChildByName("MainUI")
            .getChildByName("MauBinhController")._components[0]
            .cardGameTableController.gameController;
          let tempBet = gg.bet;
          gg.bet = 100;
          gg.onClickTuSapBai();
          gg.bet = tempBet;
        } catch (e) {
          console.log("Sap bai ERROR: ", e.toString());
        }
      };
      window.sapBaiMinh()`;

export const checkPositionCommand = `
try{
  var uuid = __require('GamePlayManager').default.Instance.loginDict.uid;
  var players = cc.find("Canvas/MainUI/MauBinhController")._components[0].cardGameTableController.gameController.AllPlayers;
  var uids = Object.keys(players);
  uids.indexOf(uuid.toString());
}catch{

}

`;
export const checkDisplayNameCommand = `
  __require('GamePlayManager').default.Instance.displayName

`;
