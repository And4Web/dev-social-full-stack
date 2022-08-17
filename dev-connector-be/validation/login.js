const Validator = require('validator');
const isEmpty = require('./isEmpty');
// import isEmpty from './isEmpty';

module.exports = function validateLoginInput(data){
  let errors = {};

  data.email = !isEmpty(data.email)? data.email: "";
  data.password = !isEmpty(data.password)? data.password: "";
  
  if(Validator.isEmpty(data.email)){
    errors.email = 'Email is Required.'
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