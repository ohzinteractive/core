class HTMLUtilities
{
  static load_images(container)
  {
    const images = container.querySelectorAll('img');

    for (let i = 0; i < images.length; i++)
    {
      const image = images[i];

      if (image.dataset.src)
      {
        image.src = image.dataset.src;
      }
    }

    const image_objects = container.querySelectorAll('object');

    for (let i = 0; i < image_objects.length; i++)
    {
      const image_object = image_objects[i];

      if (image_object.dataset.src)
      {
        image_object.data = image_object.dataset.src;
      }
    }
  }

  static load_videos(container)
  {
    const videos = container.querySelectorAll('video');

    for (let i = 0; i < videos.length; i++)
    {
      const video = videos[i];

      if (video.dataset.src)
      {
        video.src = video.dataset.src;
      }
    }
  }

  static load_iframes(container)
  {
    const iframes = container.querySelectorAll('iframe');

    for (let i = 0; i < iframes.length; i++)
    {
      const iframe = iframes[i];

      if (iframe.dataset.src)
      {
        iframe.src = iframe.dataset.src;
      }
    }
  }

  static load_elements(container, selector)
  {
    const elements = container.querySelectorAll(selector);

    for (let i = 0; i < elements.length; i++)
    {
      const element = elements[i];

      if (element.dataset.src)
      {
        element.src = element.dataset.src;
      }
    }
  }
}

export { HTMLUtilities };
