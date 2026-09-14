// Lightweight heuristic User-Agent parsing for the admin Sessions views —
// good enough to show "Chrome on Windows" style labels without pulling in a
// full UA-parsing dependency for a handful of admin-only display strings.
export interface ParsedUserAgent {
  browser: string;
  device: string;
}

export const parseUserAgent = (userAgent?: string | null): ParsedUserAgent => {
  if (!userAgent) return { browser: "Unknown", device: "Unknown device" };

  const ua = userAgent;

  let browser = "Unknown browser";
  if (/edg\//i.test(ua)) browser = "Edge";
  else if (/opr\//i.test(ua) || /opera/i.test(ua)) browser = "Opera";
  else if (/chrome|crios/i.test(ua)) browser = "Chrome";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua)) browser = "Safari";

  let device = "Desktop";
  if (/iphone/i.test(ua)) device = "iPhone";
  else if (/ipad/i.test(ua)) device = "iPad";
  else if (/android/i.test(ua))
    device = /mobile/i.test(ua) ? "Android Phone" : "Android Tablet";
  else if (/macintosh|mac os x/i.test(ua)) device = "Mac";
  else if (/windows/i.test(ua)) device = "Windows PC";
  else if (/linux/i.test(ua)) device = "Linux";

  return { browser, device };
};
