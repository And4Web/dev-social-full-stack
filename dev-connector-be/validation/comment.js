const Validator = require('validator');
const isEmpty = require('./isEmpty');
// import isEmpty from './isEmpty';

module.exports = function validateCommentInput(data){
  let errors = {};

  data.text = !isEmpty(data.text)? data.text: "";
  
  if(!Validator.isLength(data.text, {min: 1, max: 100})){
    errors.text = 'Comment must be between 1 and 100 characters.'
  }
 
  if(Validator.isEmpty(data.text)){
    errors.text = "Text field is Required."
  }
  
  return {
    errors, 
    isValid: isEmpty(errors) //returns true if there are no errors
  }
}