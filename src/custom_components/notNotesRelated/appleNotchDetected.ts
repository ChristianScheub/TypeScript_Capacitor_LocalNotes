import { Capacitor } from "@capacitor/core";
import { Device } from "@capacitor/device";

export const iOS_Notch_Present = async (): Promise<boolean> => {
  const isIOS =
    Capacitor.isNativePlatform() && Capacitor.getPlatform() === "ios";
  if (isIOS) {
    const info = await Device.getInfo();
    console.log("Infos Device");
    console.log(info.model);
    if (info.model !== "iPad8,6") {
      return true;
    }
  }
  return false;
};
