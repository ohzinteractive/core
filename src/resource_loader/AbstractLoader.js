import Validation from '../utilities/Validation';

export default class AbstractLoader
{
  constructor(resource_id, url, size = 1)
  {
    this.resource_id = resource_id;
    this.url = url;
    this.loaded_bytes = 0;
    this.total_bytes = size;

    this.has_finished = false;
    this.has_error = false;
    this.error_message = 'none';
  }

  __update_downloaded_bytes(loaded, total)
  {
    loaded = Validation.is_number(loaded) ? loaded : 1;
    total  = Validation.is_number(total)  ? total  : 1;

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

  __set_error(message)
  {
    this.has_error = true;
    this.error_message = message;
  }

  print_error()
  {
    console.error('Error while loading ' + this.resource_id + '\n\t path: ' + this.url + '\n\t\t' + this.error_message);
  }

  load(resource_container)
  {
    fetch(this.url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      redirect: 'follow' // manual, *follow, error
    })
      .then(this.on_progress.bind(this, resource_container))
      .catch(this.__on_error.bind(this));
  }

  async on_progress(resource_container, response)
  {
    const reader = response.body.getReader();

    // Step 2: get total length
    let contentLength = +response.headers.get('Content-Length');

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

    this.on_preloaded_finished(resource_container);
  }

  on_preloaded_finished(resource_container)
  {
  }

  __on_error(data)
  {
    console.error(data);
  }
}
