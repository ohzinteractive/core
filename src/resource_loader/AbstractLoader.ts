
export class AbstractLoader
{
  resource_id: any;
  url: any;
  loaded_bytes: any;
  total_bytes: any;
  has_finished: any;
  has_error: any;
  error_message: any;

  constructor(resource_id: any, url: any, size = 1)
  {
    this.resource_id = resource_id;
    this.url = url;
    this.loaded_bytes = 0;
    this.total_bytes = size;

    this.has_finished = false;
    this.has_error = false;
    this.error_message = 'none';
  }

  __update_downloaded_bytes(loaded: any, total: any)
  {
    loaded = this.is_number(loaded) ? loaded : 1;
    total  = this.is_number(total)  ? total  : 1;

    this.loaded_bytes = loaded;

    if (total > 0)
    {
      this.total_bytes = total;
    }

    if (this.loaded_bytes > this.total_bytes)
    {
      console.warn('Total bytes is smaller than loaded ones. Please set total bytes by hand to:', this.url);
    }
  }

  __loading_ended()
  {
    this.has_finished = true;
  }

  __set_error(message: any)
  {
    this.has_error = true;
    this.error_message = message;
  }

  print_error()
  {
    console.error('Error while loading ' + this.resource_id + '\n\t path: ' + this.url + '\n\t\t' + this.error_message);
  }

  load(resource_container: any)
  {
    if (resource_container.resources_by_url[this.url] === undefined)
    {
      const cache = 'default';

      fetch(this.url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: cache, // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        redirect: 'follow' // manual, *follow, error
      })
        .then(this.on_progress.bind(this, resource_container))
        .catch(this.__on_error.bind(this));
    }
    else
    {
      resource_container.set_resource(this.resource_id, this.url, resource_container.resources_by_url[this.url]);

      this.__update_downloaded_bytes(1, 1);
      this.__loading_ended();
    }
  }

  async on_progress(resource_container: any, response: any)
  {
    const response_clone = response.clone();
    const reader = response.body.getReader();

    // Step 2: get total length
    const contentLength = +response.headers.get('Content-Length');

    // Step 3: read the data
    let receivedLength = 0; // received that many bytes at the moment

    while (true)
    {
      const { done, value } = await reader.read();

      if (done)
      {
        break;
      }

      receivedLength += value.length;

      this.__update_downloaded_bytes(receivedLength, contentLength);
      // console.log(`Received ${receivedLength} of ${contentLength}`);
    }

    if (response.ok)
    {
      this.on_preloaded_finished(resource_container, response_clone);
    }
    else
    {
      this.__set_error(`${response.status}: ${response.statusText}`);
      this.__loading_ended();
    }
  }

  on_preloaded_finished(resource_container: any, response: any)
  {
  }

  __on_error(data: any)
  {
    console.error(data);
  }

  is_int(n: any)
  {
    return Number(n) === n && n % 1 === 0;
  }

  is_float(n: any)
  {
    return Number(n) === n && n % 1 !== 0;
  }

  is_number(n: any)
  {
    return this.is_int(n) || this.is_float(n);
  }
}
