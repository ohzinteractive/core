
class OS
{
  is_android: any;
  is_ios: any;
  is_ipad: any;
  is_linux: any;
  is_mac: any;
  is_mobile: any;
  is_windows: any;
  operating_systems: any;
  init()
  {
    this.operating_systems = {
      ANDROID: 'android',
      IOS: 'ios',
      LINUX: 'linux',
      MAC: 'mac',
      WINDOWS: 'windows'
    };

    this.is_mobile = !!(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/));
    this.is_ipad = !!(navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
    this.is_ios = !!navigator.userAgent.match(/(iPhone|iPod|iPad)/) || this.is_ipad;

    this.is_android = this.get_os() === this.operating_systems.ANDROID;
    this.is_linux = this.get_os() === this.operating_systems.LINUX;
    this.is_mac = this.get_os() === this.operating_systems.MAC;
    this.is_windows = this.get_os() === this.operating_systems.WINDOWS;
  }

  get_os()
  {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
    let os = null;

    if (macosPlatforms.indexOf(platform) !== -1)
    {
      os = this.operating_systems.MAC;
    }
    else if (iosPlatforms.indexOf(platform) !== -1)
    {
      os = this.operating_systems.IOS;
    }
    else if (windowsPlatforms.indexOf(platform) !== -1)
    {
      os = this.operating_systems.WINDOWS;
    }
    else if (/Android/.test(userAgent))
    {
      os = this.operating_systems.ANDROID;
    }
    else if (!os && /Linux/.test(platform))
    {
      os = this.operating_systems.LINUX;
    }

    return os;
  }
}

const os = new OS();
export { os as OS };
