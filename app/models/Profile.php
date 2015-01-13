<?php

class Profile extends Eloquent {
	protected $guarded = array();

	public static $rules = array();

  public function juzer()
  {
    return $this->belongsTo('User', 'user_id');
  }
}
