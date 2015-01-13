<?php

class Reply extends Eloquent {
	protected $guarded = array();

	public static $rules = array();

  protected $table = 'replies';

  protected $softDelete = true;

  public function comment()
  {
    return $this->belongsTo('Comment');
  }

  public function juzer()
  {
    return $this->belongsTo('User', 'user_id');
  }
}
