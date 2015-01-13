<?php namespace App\Services\Validators;

use \TaskCreateValidateException as ValidateException;

abstract class Validator {

  protected $data;
  //protected $validacion;

  //protected $errors;       # ret with getErrors *
  public $errors;

  //public static $rules;
  protected $rulez = array();

  public function __construct($data = null) 
  {
    $this->data = $data ?: \Input::all();     # if no $data passed take input
  }

  public function passes() 
  {
    $rulez = $this->getRulez();
    //$validation = \Validator::make($this->data, static::$rules);
    $validation = \Validator::make($this->data, $this->rulez);
    if ($validation->passes()) return true;
    
    $this->errors = $validation->messages();
    return false;
  }

  // public function getErrors() {
  //   return $this->errors;        # *
  // }

  // public function addRule($field, $rule) {
  //   if (isset(static::$rules[$field])) 
  //   {
  //     static::$rules[$field] .= '|' . $rule;
  //   }
  //   else
  //   {
  //     static::$rules[$field] = $rule;
  //   }
  // }

  public function validate()
  {
    $rulez = $this->getRulez();
    //$this->validacion = \Validator::make($this->data, $this->rulez);
    $validation = \Validator::make($this->data, $this->rulez);

    if ($validation->fails()) {
      throw new ValidateException($validation);
    }
  }

  public function getRulez() {
    return $this->rulez;
  }

  # set_afterRule
  public function setRule($key, $val) {
    $this->rulez[$key] = 'required|after:' . $val;
  }

}
