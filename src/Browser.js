
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
    }

    console.log(this.browser_name);
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
    return this.is_chrome || this.is_firefox || this.is_edge_chromium;
  }

  get has_hvec()
  {
    return this.is_safari;
  }

  get preferred_video_extension()
  {
    return this.has_webm ? 'webm' : this.has_hvec ? 'hvec.mp4' : 'mp4';
  }
}

export default new Browser();
