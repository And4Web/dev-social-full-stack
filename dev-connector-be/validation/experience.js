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
  
  if(Validator.isEmpty(data.company)){
    errors.company = 'Company is Required.'
  }
  
  if(Validator.isEmpty(data.from)){
    errors.from = 'From Date is Required.'
  }
  
  return {
    errors, 
    isValid: isEmpty(errors) //returns true if there are no errors
  }
}