<?php namespace App\Models;

// class Task extends Eloquent {
class Task extends \Eloquent {
	
  protected $guarded = array();
	// public static $rules = array();   # TaskXyValidator

  protected $softDelete = true;

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

  public function project()
  {
    return $this->belongsTo('Project');
  }

  public function subtasks()
  {
    return $this->hasMany('Subtask');
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
