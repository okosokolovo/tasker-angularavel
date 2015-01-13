<?php

class Tasktype extends Eloquent {
  protected $guarded = array();

  public static $rules = array();

  protected $table = 'tasktypes';

  public function task()
  {
    return $this->hasOne('Task');
  }

  public function subtask()
  {
    return $this->hasOne('Subask');
  }
}
