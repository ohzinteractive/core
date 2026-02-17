class DrawIOAnimationSheet
{
  constructor()
  {

  }

  parse(xml_document: string)
  {
    const doc = new DOMParser().parseFromString(xml_document, 'text/xml');

    const animation_nodes = doc.querySelectorAll('mxGeometry');

    const animation_tracks = [];
    const triggers = [];

    for (let i = 0; i < animation_nodes.length; i++)
    {
      const node = animation_nodes[i];
      const parent_node = node.parentElement;
      const data = parent_node.getAttribute('value');

      const x_pos = this.get_node_x_position(node);

      const from = x_pos / 100;
      const duration = parseFloat(node.getAttribute('width')) / 100;

      // is trigger
      if (parent_node.getAttribute('style').includes('rhombus;'))
      {
        const split_data = data.split('.');
        const trigger_name = split_data[0];
        const trigger_method = split_data[1];

        triggers.push({
          name: trigger_name,
          method: trigger_method,
          at_time: from + duration * 0.5
        });
      }

      const valid_element = parent_node.getAttribute('style').includes('rounded=0;') &&
                           !parent_node.getAttribute('style').includes('text;');

      if (valid_element && data !== '' && !data.includes(' '))
      {
        const split_data = data.split('=');

        const attribute_name = split_data[0];

        const value_data = split_data[1].split('--');
        const to_value = parseFloat(value_data[0]);
        const easing_function = value_data[1];

        if (split_data.length !== 2)
        {
          console.error('DrawIO data is malformed:', data);
        }

        if (value_data.length !== 2)
        {
          console.error('DrawIO data is malformed:', data);
        }

        animation_tracks.push({
          attribute_name: attribute_name,
          from_time: from,
          to_time: from + duration,
          to_value: to_value,
          easing_function: easing_function
        });
      }
    }

    animation_tracks.sort((a, b) =>
    {
      return a.from_time - b.from_time;
    });
    return {
      animation_tracks: animation_tracks,
      triggers: triggers
    };
  }

  get_node_x_position(node: HTMLElement)
  {
    const x_pos = node.getAttribute('x');
    return x_pos === null ? 0 : parseFloat(x_pos);
  }
}

export { DrawIOAnimationSheet };
