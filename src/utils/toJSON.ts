import { Document, Schema } from "mongoose";

const toJSONPlugin = (schema: Schema) => {
  schema.method('toJSON', function () {
    const obj: Document = this.toObject()
    obj.id = obj._id.toString();
  
    delete obj.__v;
    delete obj._id
    return obj
  })
}

export default toJSONPlugin