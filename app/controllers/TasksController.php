<?php

//use App\Services\Validators\TaskValidator;
use App\Services\Validators\TaskUpdateValidator;
use App\Services\Validators\TaskCreateValidator;

class TasksController extends BaseController {

    protected $task;
    protected $project;

    public function __construct(Task $task, Project $project)
    {
        $this->task = $task;
        $this->project = $project;
    }

    public function index($c_id, $p_id)
    {
        // Clockwork::startEvent('client.project.tasks.get', 'Client Project Tasks Eager loading, Caching');

        if (Cache::has($c_id.'_client_project_'.$p_id.'tasks')) {
            $tasks = Cache::get($c_id.'_client_project_'.$p_id.'tasks');
        } else {
            //$tasks = Task::with('project', 'subtasks.tags', 'teke', 'tags', 'comments', 'juzers')->where('project_id', $p_id)->get();
            $tasks = $this->task->with('project', 'subtasks.tags', 'tekas', 'tags', 'comments.replies', 'juzers', 'tasktype')->where('project_id', $p_id)->get();
            foreach ($tasks as $task) {
                $task->subtasks_count = $task->subtasks->count();
                $task->description = html_entity_decode($task->description);
                $subtasks = $task->subtasks;
                foreach ($subtasks as $subtask) {
                    $subtask->description = html_entity_decode($subtask->description);
                }
            }
            if ($tasks->first()) {      // !$tasks->isEmpty()
                Cache::put($c_id.'_client_project_'.$p_id.'tasks', $tasks, 60);
            }
        }

        // Clockwork::endEvent('client.project.tasks.get');
        if(Request::ajax()) 
        {
            // Clockwork::info($tasks);
            if (!$tasks->isEmpty()) {
                return $tasks;
            } else {
                return Response::json(array('flash' => 'no tasks yet!'));
            }
        }
    }

    public function store_uj($c_id, $p_id)
    {
        // Clockwork::startEvent('task.create', 'Create Task');

        /// validate
        $v = new TaskCreateValidator;               // $v = new TaskValidator;
        if(!$v->is_creatable($p_id)) {
            // Clockwork::endEvent('task.create');
            return Response::json(array('flash' => 'NEMERE (No Authorisation)!'));
        }
        try {
            $v->validate();
        }
        //catch (ValidateException $errors) {
        catch (TaskCreateValidateException $errors) {
            // Clockwork::endEvent('task.create');
            return Response::json(array('errors' => $errors->getErrors()->toArray()));
        }
        /// create
        $ujtask = new Task;
        $ujtask->project_id = Input::get('project_id');
        $ujtask->name = Input::get('name');
        $ujtask->description = Input::get('description');
        $ujtask->type = Input::get('type');
        $ujtask->created_by = Auth::user()->id;
        $ujtask->save();
        /// relations
        $ujtask->juzers()->attach(Auth::user()->id);
        $jope = $this->task->with('project', 'subtasks.tags', 'tekas', 'tags', 'comments.replies', 'juzers', 'tasktype')->where('id', $ujtask->id)->first();

        /// collection recache   
        Tartalek::tasks_recache($c_id, $p_id);

        // Clockwork::endEvent('task.create');
        if (Request::ajax())
        {
            // Clockwork::info($ujtask);
            // Clockwork::info($jope);
            return $jope;
        }
    }

    public function update($c_id, $p_id, $id)
    {
        // Clockwork::startEvent('task.patch', 'Task update');

        /// validate
        $v = new TaskUpdateValidator;      // $v = new TaskValidator;
        if(!$v->is_editable($p_id, $id)) {
            // Clockwork::endEvent('task.patch');
            return Response::json(array('flash' => 'NEMERE (No Authorisation)!'));
        }
        if (!$v->passes()) {
            // Clockwork::endEvent('task.patch');
            return Response::json(array('errors' => $v->errors->toArray()));    //$v->getErrors()
        }
        /// update
        $current = $this->task->find($id);
        $current->name = \Input::get('name');
        $current->type = \Input::get('type');
        $current->importance = \Input::get('importance');
        $current->due = \Input::get('due');
        $current->completed = \Input::get('completed');
        $current->description = \Input::get('description');
        $current->completed_by = \Input::get('completed_by');
        $current->save();
        $jope = $this->task->with('project', 'subtasks.tags', 'tags', 'comments.replies', 'juzers', 'tekas', 'tasktype')->where('id', $id)->first();

        /// collection recache
        Tartalek::tasks_recache($c_id, $p_id);

        // Clockwork::endEvent('task.patch');
        if (Request::ajax())
        {
            // Clockwork::info($current);
            // Clockwork::info($jope);
            return $jope;
        }
    }

    public function destroy_uj($c_id, $p_id, $id)
    {
        // Clockwork::startEvent('ujtask.delete', 'UjTask delete');

        $ujtask = $this->task->findOrFail($id);

        $ujtask->juzers()->detach(Auth::user()->id);        //detach ownerables

        //$ujtask->delete();     // softdelete not enough
        $ujtask->forceDelete();

        if (Cache::has($c_id.'_client_project_'.$p_id.'tasks')) {
            Cache::forget($c_id.'_client_project_'.$p_id.'tasks');
        }

        // Clockwork::endEvent('ujtask.delete');
        return Response::json(array('flash' => 'UJTask cancelled!'));
    }

    public function destroy($c_id, $p_id, $id)
    {
        // Clockwork::startEvent('task.delete', 'Task delete');

        $ujtask = $this->task->findOrFail($id);

        $ujtask->juzers()->detach(Auth::user()->id);        //detach ownerables

        $ujtask->delete();     // softdelete ok
        //$ujtask->forceDelete();

        if (Cache::has($c_id.'_client_project_'.$p_id.'tasks')) {
            Cache::forget($c_id.'_client_project_'.$p_id.'tasks');
        }

        // Clockwork::endEvent('task.delete');
        return Response::json(array(
            'flash' => 'Task deleted!',
            'deleted_task_id' => $id
        ));
    }

}
