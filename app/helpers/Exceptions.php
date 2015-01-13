<?php

use Illuminate\Validation\Validator;

class TaskCreateValidateException extends \Exception {
  private $errors;

  public function __construct(Validator $validator)
  {
    $this->validator = $validator;
  }

  public function getErrors()
  {
    $this->errors = $this->validator->messages();
    return $this->errors;
  }
}
