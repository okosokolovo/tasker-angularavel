<?php

class Tekatype extends Eloquent {
	protected $guarded = array();

	public static $rules = array();

  protected $table = 'filetypes';

  public function teka()
  {
    return $this->hasOne('Teka');
  }
}
