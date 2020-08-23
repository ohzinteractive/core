
export class OS
{
  constructor()
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

  is_android()
  {
    return this.get_os() === this.operating_systems.ANDROID;
  }

  is_ios()
  {
    return this.get_os() === this.operating_systems.IOS;
  }

  is_linux()
  {
    return this.get_os() === this.operating_systems.MAC;
  }

  is_mac()
  {
    return this.get_os() === this.operating_systems.MAC;
  }

  is_windows()
  {
    return this.get_os() === this.operating_systems.MAC;
  }
}

export default new OS();
