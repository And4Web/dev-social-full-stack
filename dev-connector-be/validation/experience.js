const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateExperienceInput(data){
  let errors = {};

  data.title = !isEmpty(data.title)? data.title: "";
  data.company = !isEmpty(data.company)? data.company: "";
  data.from = !isEmpty(data.from)? data.from: "";
  
  if(Validator.isEmpty(data.title)){
    errors.title = 'Title is Required.'
  }
  if(!Validator.isEmail(data.email)){
    errors.email = 'Enter valid Email.'
  }  
  if(Validator.isEmpty(data.password)){
    errors.password = "Password is Required."
  }
  
  return {
    errors, 
    isValid: isEmpty(errors) //returns true if there are no errors
  }
}