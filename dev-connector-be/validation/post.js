const Validator = require('validator');
const isEmpty = require('./isEmpty');
// import isEmpty from './isEmpty';

module.exports = function validatePostInput(data){
  let errors = {};

  data.text = !isEmpty(data.text)? data.text: "";
  
  if(!Validator.isLength(data.text, {min: 10, max: 1000})){
    errors.text = 'Post must be between 10 and 1000 characters.'
  }
 
  if(Validator.isEmpty(data.text)){
    errors.text = "Text field is Required."
  }
  
  return {
    errors, 
    isValid: isEmpty(errors) //returns true if there are no errors
  }
}