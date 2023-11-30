import { Schema } from "mongoose";

const softDeletePlugin = (schema: Schema) => {
  // add delete method to update the deleted field and save
  schema.method('delete', function() {
    this.isDeleted = true;
    return this.save();
  });
  
  // restrict find and findOne to only return documents that are not deleted.
  schema.pre(['find', 'findOne'], function (next) {
    // add query to get only documents with deletedAt = null
    // you can check that middleware is disabled in a case where you want to get all data including deleted data
    if (!this.getOptions().includeDeleted === true ) {
      this.where({ isDeleted: false });
    }
    next();
  });
};

export default softDeletePlugin;