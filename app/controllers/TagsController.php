<?php

class TagsController extends BaseController {

  protected $tag;

  public function __construct(Tag $tag)
  {
    $this->tag = $tag;
  }

  public function index()
  {
    $tags = $this->tag->all();

    /// cache...

    if (Request::ajax()) {
      return $tags;
    }
  }

  public function store()
  {
    $ujtag = new Tag;
    $ujtag->name = Input::get('name');
    $ujtag->save();
    if (Input::get('task_id')) {
      $ujtag->tasks()->attach(Input::get('task_id'));
    }
    if (Input::get('subtask_id')) {
      $ujtag->subtasks()->attach(Input::get('subtask_id'));
    }

    /// recache...

    if (Request::ajax()) {
      return $ujtag;
    }
  }

  public function destroy($id)
  {
    //
  }
}
