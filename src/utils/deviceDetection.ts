// Comprehensive Device Detection Utility
// Captures detailed device, browser, and system information

export interface DeviceInfo {
  // Basic device info
  deviceType: 'desktop' | 'tablet' | 'mobile';
  deviceName: string;
  deviceModel: string;
  deviceManufacturer: string;
  
  // Browser info
  browser: string;
  browserVersion: string;
  userAgent: string;
  
  // OS info
  os: string;
  osVersion: string;
  
  // Screen and display
  screenResolution: string;
  viewportWidth: number;
  viewportHeight: number;
  colorDepth: number;
  pixelRatio: number;
  
  // Device capabilities
  touchSupport: boolean;
  webglSupport: boolean;
  cookieEnabled: boolean;
  doNotTrack: boolean;
  javascriptEnabled: boolean;
  
  // Performance metrics
  pageLoadTime: number;
  networkSpeed: string;
  connectionType: string;
  
  // Hardware info
  cpuCores: number;
  memoryGb: number;
  
  // Location info
  language: string;
  timezone: string;
  
  // Session info
  sessionId: string;
  landingPage: string;
  referrer: string;
  
  // Security and privacy
  adBlockerDetected: boolean;
  proxyDetected: boolean;
  vpnDetected: boolean;
  torDetected: boolean;
  botDetected: boolean;
  
  // Plugin detection
  flashEnabled: boolean;
  javaEnabled: boolean;
  silverlightEnabled: boolean;
  pdfViewer: string;
  quicktimeEnabled: boolean;
  realplayerEnabled: boolean;
  windowsmediaEnabled: boolean;
  vlcEnabled: boolean;
  shockwaveEnabled: boolean;
  activexEnabled: boolean;
  vbsEnabled: boolean;
  vbEnabled: boolean;
  perlEnabled: boolean;
  pythonEnabled: boolean;
  rubyEnabled: boolean;
  phpEnabled: boolean;
  aspEnabled: boolean;
  jspEnabled: boolean;
  coldfusionEnabled: boolean;
  cgiEnabled: boolean;
}

// Detect device type
function detectDeviceType(): 'desktop' | 'tablet' | 'mobile' {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /mobile|android|iphone|ipad|phone|blackberry|opera mini|iemobile/i.test(userAgent);
  const isTablet = /tablet|ipad|playbook|silk/i.test(userAgent);
  
  if (isTablet) return 'tablet';
  if (isMobile) return 'mobile';
  return 'desktop';
}

// Detect browser and version
function detectBrowser(): { browser: string; version: string } {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Firefox/')) {
    const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
    return { browser: 'Firefox', version: match ? match[1] || 'unknown' : 'unknown' };
  }
  
  if (userAgent.includes('Chrome/')) {
    const match = userAgent.match(/Chrome\/(\d+\.\d+)/);
    return { browser: 'Chrome', version: match ? match[1] || 'unknown' : 'unknown' };
  }
  
  if (userAgent.includes('Safari/') && !userAgent.includes('Chrome/')) {
    const match = userAgent.match(/Version\/(\d+\.\d+)/);
    return { browser: 'Safari', version: match ? match[1] || 'unknown' : 'unknown' };
  }
  
  if (userAgent.includes('Edge/')) {
    const match = userAgent.match(/Edge\/(\d+\.\d+)/);
    return { browser: 'Edge', version: match ? match[1] || 'unknown' : 'unknown' };
  }
  
  if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) {
    const match = userAgent.match(/MSIE (\d+\.\d+)/);
    return { browser: 'Internet Explorer', version: match ? match[1] || 'unknown' : 'unknown' };
  }
  
  return { browser: 'Unknown', version: 'unknown' };
}

// Detect operating system
function detectOS(): { os: string; version: string } {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Windows')) {
    const match = userAgent.match(/Windows NT (\d+\.\d+)/);
    let version = 'unknown';
    if (match) {
      const major = parseInt(match[1] || '0');
      if (major === 10) version = '10';
      else if (major === 6.3) version = '8.1';
      else if (major === 6.2) version = '8';
      else if (major === 6.1) version = '7';
      else if (major === 6.0) version = 'Vista';
      else if (major === 5.2) version = 'XP x64';
      else if (major === 5.1) version = 'XP';
    }
    return { os: 'Windows', version };
  }
  
  if (userAgent.includes('Mac OS X')) {
    const match = userAgent.match(/Mac OS X (\d+[._]\d+)/);
    return { os: 'macOS', version: match ? (match[1] || 'unknown').replace('_', '.') : 'unknown' };
  }
  
  if (userAgent.includes('Linux')) {
    return { os: 'Linux', version: 'unknown' };
  }
  
  if (userAgent.includes('Android')) {
    const match = userAgent.match(/Android (\d+\.\d+)/);
    return { os: 'Android', version: match ? match[1] || 'unknown' : 'unknown' };
  }
  
  if (userAgent.includes('iOS')) {
    const match = userAgent.match(/OS (\d+_\d+)/);
    return { os: 'iOS', version: match ? (match[1] || 'unknown').replace('_', '.') : 'unknown' };
  }
  
  return { os: 'Unknown', version: 'unknown' };
}

// Detect device manufacturer and model
function detectDeviceInfo(): { manufacturer: string; model: string; name: string } {
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('iPhone')) {
    return { manufacturer: 'Apple', model: 'iPhone', name: 'iPhone' };
  }
  
  if (userAgent.includes('iPad')) {
    return { manufacturer: 'Apple', model: 'iPad', name: 'iPad' };
  }
  
  if (userAgent.includes('Macintosh')) {
    return { manufacturer: 'Apple', model: 'Mac', name: 'Mac' };
  }
  
  if (userAgent.includes('Android')) {
    if (userAgent.includes('Samsung')) {
      return { manufacturer: 'Samsung', model: 'Android', name: 'Samsung Android' };
    }
    if (userAgent.includes('HTC')) {
      return { manufacturer: 'HTC', model: 'Android', name: 'HTC Android' };
    }
    if (userAgent.includes('LG')) {
      return { manufacturer: 'LG', model: 'Android', name: 'LG Android' };
    }
    if (userAgent.includes('Motorola')) {
      return { manufacturer: 'Motorola', model: 'Android', name: 'Motorola Android' };
    }
    if (userAgent.includes('Sony')) {
      return { manufacturer: 'Sony', model: 'Android', name: 'Sony Android' };
    }
    return { manufacturer: 'Unknown', model: 'Android', name: 'Android Device' };
  }
  
  if (userAgent.includes('Windows')) {
    return { manufacturer: 'Microsoft', model: 'PC', name: 'Windows PC' };
  }
  
  return { manufacturer: 'Unknown', model: 'Unknown', name: 'Unknown Device' };
}

// Detect network information
function detectNetworkInfo(): { speed: string; type: string } {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  if (connection) {
    let type = 'unknown';
    if (connection.effectiveType) {
      type = connection.effectiveType;
    } else if (connection.type) {
      type = connection.type;
    }
    
    let speed = 'unknown';
    if (connection.downlink) {
      speed = `${connection.downlink} Mbps`;
    }
    
    return { speed, type };
  }
  
  return { speed: 'unknown', type: 'unknown' };
}

// Detect hardware capabilities
function detectHardwareInfo(): { cpuCores: number; memoryGb: number } {
  const cpuCores = (navigator as any).hardwareConcurrency || 1;
  const memoryGb = (navigator as any).deviceMemory || 0;
  
  return { cpuCores, memoryGb };
}

// Detect ad blocker
async function detectAdBlocker(): Promise<boolean> {
  try {
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbox';
    testAd.style.position = 'absolute';
    testAd.style.left = '-10000px';
    document.body.appendChild(testAd);
    
    const isBlocked = testAd.offsetHeight === 0;
    document.body.removeChild(testAd);
    
    return isBlocked;
  } catch {
    return false;
  }
}

// Detect plugins
function detectPlugins(): Record<string, boolean> {
  const plugins: Record<string, boolean> = {};
  
  // Flash
  try {
    const flash = (navigator as any).plugins['Shockwave Flash'];
    plugins['flash'] = !!flash;
  } catch {
          plugins['flash'] = false;
  }
  
  // Java
  try {
    plugins['java'] = (navigator as any).javaEnabled();
  } catch {
    plugins['java'] = false;
  }
  
  // PDF
  try {
    const pdf = (navigator as any).plugins['Chrome PDF Plugin'] || (navigator as any).plugins['Adobe Acrobat'];
    plugins['pdf'] = !!pdf;
  } catch {
    plugins['pdf'] = false;
  }
  
  // Other plugins (set to false for now as they're deprecated)
  plugins['silverlight'] = false;
  plugins['quicktime'] = false;
  plugins['realplayer'] = false;
  plugins['windowsmedia'] = false;
  plugins['vlc'] = false;
  plugins['shockwave'] = false;
  plugins['activex'] = false;
  plugins['vbs'] = false;
  plugins['vb'] = false;
  plugins['perl'] = false;
  plugins['python'] = false;
  plugins['ruby'] = false;
  plugins['php'] = false;
  plugins['asp'] = false;
  plugins['jsp'] = false;
  plugins['coldfusion'] = false;
  plugins['cgi'] = false;
  
  return plugins;
}

// Generate session ID
function generateSessionId(): string {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Main function to collect all device information
export async function collectDeviceInfo(): Promise<DeviceInfo> {
  const startTime = performance.now();
  
  // Wait for page to load
  if (document.readyState !== 'complete') {
    await new Promise(resolve => {
      window.addEventListener('load', resolve);
    });
  }
  
  const pageLoadTime = Math.round(performance.now() - startTime);
  
  const deviceType = detectDeviceType();
  const { browser, version: browserVersion } = detectBrowser();
  const { os, version: osVersion } = detectOS();
  const { manufacturer, model, name } = detectDeviceInfo();
  const { speed: networkSpeed, type: connectionType } = detectNetworkInfo();
  const { cpuCores, memoryGb } = detectHardwareInfo();
  const plugins = detectPlugins();
  const adBlockerDetected = await detectAdBlocker();
  
  // Detect viewport dimensions
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  
  // Detect screen properties
  const screen = window.screen;
  const screenResolution = `${screen.width}x${screen.height}`;
  const colorDepth = screen.colorDepth;
  const pixelRatio = window.devicePixelRatio || 1;
  
  // Detect capabilities
  const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const webglSupport = !!window.WebGLRenderingContext;
  const cookieEnabled = navigator.cookieEnabled;
  const doNotTrack = navigator.doNotTrack === '1';
  const javascriptEnabled = true; // If this runs, JS is enabled
  
  // Security detection (basic)
  const proxyDetected = false; // Would need server-side detection
  const vpnDetected = false; // Would need server-side detection
  const torDetected = false; // Would need server-side detection
  const botDetected = false; // Would need more sophisticated detection
  
  return {
    deviceType,
    deviceName: name,
    deviceModel: model,
    deviceManufacturer: manufacturer,
    browser,
    browserVersion,
    userAgent: navigator.userAgent,
    os,
    osVersion,
    screenResolution,
    viewportWidth,
    viewportHeight,
    colorDepth,
    pixelRatio,
    touchSupport,
    webglSupport,
    cookieEnabled,
    doNotTrack,
    javascriptEnabled,
    pageLoadTime,
    networkSpeed,
    connectionType,
    cpuCores,
    memoryGb,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    sessionId: generateSessionId(),
    landingPage: window.location.href,
    referrer: document.referrer,
    adBlockerDetected,
    proxyDetected,
    vpnDetected,
    torDetected,
    botDetected,
    flashEnabled: plugins['flash'] || false,
    javaEnabled: plugins['java'] || false,
    silverlightEnabled: plugins['silverlight'] || false,
    pdfViewer: plugins['pdf'] ? 'Built-in' : 'None',
    quicktimeEnabled: plugins['quicktime'] || false,
    realplayerEnabled: plugins['realplayer'] || false,
    windowsmediaEnabled: plugins['windowsmedia'] || false,
    vlcEnabled: plugins['vlc'] || false,
    shockwaveEnabled: plugins['shockwave'] || false,
    activexEnabled: plugins['activex'] || false,
    vbsEnabled: plugins['vbs'] || false,
    vbEnabled: plugins['vb'] || false,
    perlEnabled: plugins['perl'] || false,
    pythonEnabled: plugins['python'] || false,
    rubyEnabled: plugins['ruby'] || false,
    phpEnabled: plugins['php'] || false,
    aspEnabled: plugins['asp'] || false,
    jspEnabled: plugins['jsp'] || false,
    coldfusionEnabled: plugins['coldfusion'] || false,
    cgiEnabled: plugins['cgi'] || false
  };
}

// Function to get IP address (requires external service)
export async function getIPInfo(): Promise<{
  ip: string;
  country: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  isp: string;
  organization: string;
  asNumber: string;
}> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    return {
      ip: data.ip || 'unknown',
      country: data.country_name || 'unknown',
      city: data.city || 'unknown',
      state: data.region || 'unknown',
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      isp: data.org || 'unknown',
      organization: data.org || 'unknown',
      asNumber: data.asn || 'unknown'
    };
  } catch (error) {
    console.warn('Failed to get IP info:', error);
    return {
      ip: 'unknown',
      country: 'unknown',
      city: 'unknown',
      state: 'unknown',
      latitude: 0,
      longitude: 0,
      isp: 'unknown',
      organization: 'unknown',
      asNumber: 'unknown'
    };
  }
}
