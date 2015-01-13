<?php

class Client extends Eloquent {
	//protected $guarded = array();
  protected $fillable = array('name', 'email', 'website', 'contact_person');

	public static $rules = array(
    'name' => 'required|min:3|alpha_num',
    'email' => 'required|unique:clients,email|email',
    //'website' => 'active_url'
    'website' => 'url'
  );

  protected $softDelete = true;

  //public function users()   #owners
  public function juzers()
  {
    return $this->morphToMany('User', 'ownerables')->withPivot('admin', 'tasker');
  }

  public function projects()
  {
    return $this->hasMany('Project');
  }
}
