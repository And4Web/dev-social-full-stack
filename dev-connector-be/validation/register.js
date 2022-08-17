const Validator = require('validator');
const isEmpty = require('./isEmpty');
// import isEmpty from './isEmpty';

module.exports = function validateRegisterInput(data){
  let errors = {};

  data.name = !isEmpty(data.name)? data.name: "";
  data.email = !isEmpty(data.email)? data.email: "";
  data.password = !isEmpty(data.password)? data.password: "";
  data.confirmPassword = !isEmpty(data.confirmPassword)? data.confirmPassword: "";

  if(!Validator.isLength(data.name, {min: 2, max: 30})){
    errors.name = 'Name must be between 2 and 30 characters.'
  }
  if(Validator.isEmpty(data.name)){
    errors.name = 'Name is Required.'
  }
  if(!Validator.isEmail(data.email)){
    errors.email = 'Enter valid Email.'
  }
  if(Validator.isEmpty(data.email)){
    errors.email = 'Email is Required.'
  }
  if(!Validator.isLength(data.password, {min: 8, max: 50})){
    errors.password = 'Password must be at least 8 characters long.'
  }
  if(Validator.isEmpty(data.password)){
    errors.password = "Password is Required."
  }
  if(Validator.isEmpty(data.confirmPassword)){
    errors.confirmPassword = 'Please confirm the password.'
  }
  if(!Validator.equals(data.password, data.confirmPassword)){
    errors.confirmPassword = "Passwords don't match."
  }
  return {
    errors, 
    isValid: isEmpty(errors) //returns true if there are no errors
  }
}