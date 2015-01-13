<?php

class Subtask extends Eloquent {
	protected $guarded = array();

	public static $rules = array(
    'name' => 'required',
    'description' => 'required'
  );

  protected $softDelete = true;

  public function task()
  {
    return $this->belongsTo('Task');
  }

  public function tags()
  {
    return $this->morphToMany('Tag', 'taggables');
  }

  // public function users()  # owners
  public function juzers()
  {
    return $this->morphToMany('User', 'ownerables')->withPivot('admin', 'tasker');
  }

  public function tekas()
  {
    return $this->hasMany('Teka');
  }

  public function comments()
  {
    return $this->hasMany('Comment');
  }

  public function tasktype()
  {
    return $this->belongsTo('Tasktype');
  }
}
