<?php

class Tag extends Eloquent {
	protected $guarded = array();

	public static $rules = array();

  public function tasks()
  {
    return $this->morphedByMany('Task', 'taggables');
  }

  public function subtasks()
  {
    return $this->morphedByMany('Subtask', 'taggables');
  }
}
