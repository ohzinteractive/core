export default class DrawIOAnimationSheet
{
  constructor()
  {

  }

  parse(xml_document)
  {
    let doc = new DOMParser().parseFromString(xml_document, 'text/xml');

    let animation_nodes = doc.querySelectorAll('mxGeometry');

    let animation_tracks = [];
    let triggers = [];

    for (let i = 0; i < animation_nodes.length; i++)
    {
      let node = animation_nodes[i];
      let parent_node = node.parentElement;
      let data = parent_node.getAttribute('value');

      let x_pos = this.get_node_x_position(node);

      let from = x_pos / 100;
      let duration = parseFloat(node.getAttribute('width')) / 100;

      // is trigger
      if (parent_node.getAttribute('style').includes('rhombus;'))
      {
        let split_data = data.split('.');
        let trigger_name = split_data[0];
        let trigger_method = split_data[1];

        triggers.push({
          name: trigger_name,
          method: trigger_method,
          at_time: from + duration * 0.5
        });
      }

      let valid_element = parent_node.getAttribute('style').includes('rounded=0;') &&
                           !parent_node.getAttribute('style').includes('text;');

      if (valid_element && data !== '' && !data.includes(' '))
      {
        let split_data = data.split('=');

        let attribute_name = split_data[0];

        let value_data = split_data[1].split('--');
        let to_value = parseFloat(value_data[0]);
        let easing_function = value_data[1];

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

  get_node_x_position(node)
  {
    let x_pos = node.getAttribute('x');
    return x_pos === null ? 0 : parseFloat(x_pos);
  }
}
