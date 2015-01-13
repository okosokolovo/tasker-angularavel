<?php

class Teka extends Eloquent {
	protected $guarded = array();

	public static $rules = array();

  protected $table = 'files';

  protected $softDelete = true;

  public function task()
  {
    return $this->belongsTo('Task');
  }

  public function subtask()
  {
    return $this->belongsTo('Subtask');
  }

  public function tekatype()
  {
    return $this->belongsTo('Tekatype');
  }
}
