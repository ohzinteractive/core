export default class ObjectUtilities
{
  static is_object(item)
  {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }

  static merge_deep(target, ...sources)
  {
    if (!sources.length) return target;
    const source = sources.shift();

    if (ObjectUtilities.is_object(target) && ObjectUtilities.is_object(source))
    {
      for (const key in source)
      {
        if (ObjectUtilities.is_object(source[key]))
        {
          if (!target[key]) Object.assign(target, { [key]: {} });
          ObjectUtilities.merge_deep(target[key], source[key]);
        }
        else
        {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return ObjectUtilities.merge_deep(target, ...sources);
  }

  static xml_to_json(xml)
  {
    // Create the return object
    let obj = {};

    if (xml.nodeType === 1)
    { // element
      // do attributes
      if (xml.attributes.length > 0)
      {
        obj['@attributes'] = {};
        for (let j = 0; j < xml.attributes.length; j++)
        {
          const attribute = xml.attributes.item(j);
          obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
        }
      }
    }
    else if (xml.nodeType === 3)
    { // text
      obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes())
    {
      for (let i = 0; i < xml.childNodes.length; i++)
      {
        const item = xml.childNodes.item(i);
        const nodeName = item.nodeName;
        if (typeof (obj[nodeName]) === 'undefined')
        {
          obj[nodeName] = this.xml_to_json(item);
        }
        else
        {
          if (typeof (obj[nodeName].push) === 'undefined')
          {
            const old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(this.xml_to_json(item));
        }
      }
    }
    return obj;
  }
}
