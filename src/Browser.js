
class Browser
{
  init()
  {
    this.browser_name = '';
    this.agent = window.navigator.userAgent.toLowerCase();

    switch (true)
    {
    case this.agent.indexOf('edge') > -1:
      this.browser_name = 'edge_ie';
      break;
    case this.agent.indexOf('edg') > -1:
      this.browser_name = 'edge_chromium';
      break;
    case this.agent.indexOf('opr') > -1 && !!window.opr:
      this.browser_name = 'opera';
      break;
    case this.agent.indexOf('chrome') > -1 && !!window.chrome:
      this.browser_name = 'chrome';
      break;
    case this.agent.indexOf('trident') > -1:
      this.browser_name = 'iexplorer';
      break;
    case this.agent.indexOf('firefox') > -1:
      this.browser_name = 'firefox';
      break;
    case this.agent.indexOf('safari') > -1:
      this.browser_name = 'safari';
      break;
    default:
      this.browser_name = 'other';
      break;
    }

    this.version = this.get_version();
  }

  get name()
  {
    return this.browser_name;
  }

  get is_safari()
  {
    return this.browser_name === 'safari';
  }

  get is_chrome()
  {
    return this.browser_name === 'chrome';
  }

  get is_edge()
  {
    return this.browser_name === 'edge_ie';
  }

  get is_edge_chromium()
  {
    return this.browser_name === 'edge_chromium';
  }

  get has_webm()
  {
    return !!(this.is_chrome || this.is_firefox || this.is_edge_chromium);
  }

  get has_hvec()
  {
    return this.is_safari;
  }

  get preferred_video_extension()
  {
    return this.has_webm ? 'webm' : this.has_hvec ? 'hvec.mp4' : 'mp4';
  }

  get_version()
  {
    const ua = navigator.userAgent;
    let tem = '';
    let version = 0;

    let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1]))
    {
      tem =  /\brv[ :]+(\d+)/g.exec(ua) || [];
      version =  'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome')
    {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) version = tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    version = M.join(' ');

    return Number(version.split(' ')[1]);
  }
}

const browser = new Browser();
export { browser as Browser };
