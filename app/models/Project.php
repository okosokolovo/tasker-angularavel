<?php namespace App\Models;

// class Project extends Eloquent {
class Project extends \Eloquent {
	
  //protected $guarded = array();
  protected $fillable = array('client_id', 'name');

	public static $rules = array(
    'name' => 'required'
  );

  protected $softDelete = true;

  // public function users()  # owners
  public function juzers()
  {
    return $this->morphToMany('User', 'ownerables')->withPivot('admin', 'tasker');
  }

  public function client()
  {
    return $this->belongsTo('Client');
  }

  public function tasks()
  {
    return $this->hasMany('Task');
  }
}
