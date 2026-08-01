export const haptic = {
  light: () => {
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
    } catch (e) {}
  },
  medium: () => {
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(30);
    } catch (e) {}
  },
  heavy: () => {
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(50);
    } catch (e) {}
  },
  success: () => {
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([20, 50, 40]);
    } catch (e) {}
  },
  error: () => {
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([50, 50, 50]);
    } catch (e) {}
  },
};
