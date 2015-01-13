<?php

class SubtasksController extends BaseController {

  protected $subtask;
  protected $task;

  public function __construct(Subtask $subtask, Task $task)
  {
    $this->subtask = $subtask;
    $this->task = $task;
  }

  public function index($task_id)
  {
    // $task = $this->task->find($task_id);
    // $subtasks = $task->subtasks;
    // $count = $subtasks->count();
    // $task_name = $task->name;

    // if(Request::ajax())
    // {
    //   return Response::json(array(
    //     'task_name' => $task_name,
    //     'subtasks' => $subtasks->toArray(),
    //     'count' => $count
    //   ));
    // }
  }

  public function store()
  {
    //
  }

  public function update($c_id, $p_id, $t_id, $id)
  {
    // Clockwork::startEvent('subtask.patch', 'Subtask update');

    $current = $this->subtask->find($id);
    $current->name = \Input::get('name');
    $current->importance = \Input::get('importance');
    $current->due = \Input::get('due');
    $current->completed = \Input::get('completed');
    $current->description = \Input::get('description');
    $current->completed_by = \Input::get('completed_by');
    $current->save();

    //$subtask = Subtask::with('task', 'tags', 'comments.replies', 'tekas', 'juzers', 'tasktype')->find($id);
    $jope = $this->subtask->with('task', 'tags', 'comments.replies', 'juzers', 'tekas', 'tasktype')->where('id', $id)->first();
    // Clockwork::endEvent('subtask.patch');
    if (Request::ajax())
    {
      // Clockwork::info($current);
      // Clockwork::info($jope);
      //return Response::json($subtask);
      return $jope;
    }
  }

  public function destroy($id)
  {
    //
  }

}
