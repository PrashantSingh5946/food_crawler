const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeIngredientSchema = new Schema({
  name: String,
});

const itemListElementSchema = new Schema({
  "@type": String,
  text: String,
});

const howToStepSchema = new Schema({
  "@type": String,
  text: String,
});

const howToSectionSchema = new Schema({
  "@type": String,
  name: String,
  itemListElement: [itemListElementSchema],
});

const nutritionInformationSchema = new Schema({
  "@type": String,
  calories: String,
  carbohydrateContent: String,
  proteinContent: String,
  fatContent: String,
  saturatedFatContent: String,
  cholesterolContent: String,
  sodiumContent: String,
  fiberContent: String,
  sugarContent: String,
  servingSize: String,
});

const recipeSchema = new Schema({
  name: String,
  description: String,
  prepTime: String,
  cookTime: String,
  recipeIngredient: [String],
  recipeInstructions: [howToSectionSchema],
  nutrition: nutritionInformationSchema,
  creator_id: String,
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
