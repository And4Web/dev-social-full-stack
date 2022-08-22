const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateExperienceInput(data){
  let errors = {};

  data.school = !isEmpty(data.school)? data.school: "";
  data.course = !isEmpty(data.course)? data.course: "";
  data.degree = !isEmpty(data.degree)? data.degree: "";
  data.from = !isEmpty(data.from)? data.from: "";
  
  if(Validator.isEmpty(data.school)){
    errors.school = 'School is Required.'
  }
  
  if(Validator.isEmpty(data.course)){
    errors.course = 'Course is Required.'
  }
  
  if(Validator.isEmpty(data.degree)){
    errors.degree = 'Degree Date is Required.'
  }

  if(Validator.isEmpty(data.from)){
    errors.from = 'From Date is Required.'
  }
  
  return {
    errors, 
    isValid: isEmpty(errors) //returns true if there are no errors
  }
}