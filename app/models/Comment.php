<?php

class Comment extends Eloquent {
	protected $guarded = array();

	public static $rules = array();

  protected $softDelete = true;

  public function replies()
  {
    return $this->hasMany('Reply');
  }

  public function juzer()
  {
    return $this->belongsTo('User', 'user_id');
  }

  public function task()
  {
    return $this->belongsTo('Task');
  }

  public function subtask()
  {
    return $this->belongsTo('Subtask');
  }
}
