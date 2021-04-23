
class OS
{
  init()
  {
    this.operating_systems = {
      ANDROID: 'android',
      IOS: 'ios',
      LINUX: 'linux',
      MAC: 'mac',
      WINDOWS: 'windows'
    };
  }

  get_os()
  {
    let userAgent = window.navigator.userAgent;
    let platform = window.navigator.platform;
    let macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    let windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    let iosPlatforms = ['iPhone', 'iPad', 'iPod'];
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

  get is_android()
  {
    return this.get_os() === this.operating_systems.ANDROID;
  }

  get is_ios()
  {
    return navigator.userAgent.match(/(iPhone|iPod|iPad)/) || this.is_ipad;
  }

  get is_ipad()
  {
    return (navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
  }

  get is_mobile()
  {
    return !!(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/));
  }

  get is_linux()
  {
    return this.get_os() === this.operating_systems.LINUX;
  }

  get is_mac()
  {
    return this.get_os() === this.operating_systems.MAC;
  }

  get is_windows()
  {
    return this.get_os() === this.operating_systems.WINDOWS;
  }
}

export default new OS();
