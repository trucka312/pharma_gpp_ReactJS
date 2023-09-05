import getChannel, { IKIPOS } from "./channel";

const posTheme = {
  loginTitle: "IKIPOS",
  backgroundColor: "#E56F25",
  modalNoti: "#E56F25",
  buttonYes: "#F7C23E",
  logoTab: "/images/logo/logo-benith-tab.png",
  //   logo: "/images/logo/ikipos_logo.png",
  //   logoLogin: "/images/logo/ikipos_login.jpg",
  logo: "/images/logo/logo-benith-v2.png",
  logoLogin: "/images/logo/background-login.jpg",
  favicon: "/favicon.ico",
};

const ikitechTheme = {
  loginTitle: "BENITH",
  backgroundColor: "#009293",
  modalNoti: "#E56F25",
  buttonYes: "#F7C23E",
  logoTab: "/images/logo/logo-benith-tab.png",
  // logo: "/images/logo/ikitech_logo.jpg",
  // logoLogin: "/images/logo/ikitech_login.jpg",
  logo: "/images/logo/logo-benith-v2.png",
  logoLogin: "/images/logo/background-login.jpg",
  favicon: "/favicon.ico",
};

export default function themeData() {
  if (getChannel() == IKIPOS) {
    return posTheme;
  }

  return ikitechTheme;
}
