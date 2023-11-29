const pick = (object: Record<string, any>, keys: string[]) =>
// loop through the list of keys and pick all properties of the object.
  keys.reduce((obj: any, key: string) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = object[key];
    }
    return obj;
  }, {});

export default pick;
