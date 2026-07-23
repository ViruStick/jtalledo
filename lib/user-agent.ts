export function parseUserAgent(ua: string): string {
  const lower = ua.toLowerCase();

  const isIOS = /iphone|ipad|ipod/.test(lower);
  const isAndroid = /android/.test(lower);
  const isWindows = /windows/.test(lower);
  const isMac = /macintosh|mac os x/.test(lower) && !isIOS;
  const isLinux = /linux/.test(lower) && !isAndroid;

  const isEdge = /edg\/|edga\/|edgios\/|edge\//.test(lower);
  const isFirefox = /firefox\/|fxios\//.test(lower);
  const isChrome = (/chrome\/|crios\//.test(lower)) && !isEdge;
  const isSafari = /safari\//.test(lower) && !isChrome && !isEdge && !isFirefox;

  const browser = isEdge ? "Edge" : isFirefox ? "Firefox" : isChrome ? "Chrome" : isSafari ? "Safari" : null;
  const os = isWindows ? "Windows" : isMac ? "macOS" : isLinux ? "Linux" : isAndroid ? "Android" : isIOS ? "iOS" : null;

  if (browser && os) return `${browser} en ${os}`;
  if (browser) return browser;
  if (os) return os;
  return "Dispositivo no identificado";
}
