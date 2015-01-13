<?php

class ProjectsController extends BaseController {

  protected $project;

  public function __construct(Project $project) {
    $this->project = $project;
  }

  public function index($c_id) {
    // Clockwork::startEvent('client.projects.get', 'Client Projects Eager loading, Caching');

    $client_projects = Cache::remember($c_id.'_client_projects', 60, function()
    {
      $c_projects = $this->project->with('client', 'tasks', 'juzers')->where('client_id', Request::segment(2))->get();
      if ($c_projects->first()) {
        return $c_projects;
      }
    });

    // Clockwork::endEvent('client.projects.get');

    if (Request::ajax())
    {
      // Clockwork::info($client_projects);
      if ($client_projects) {
        return $client_projects;
      } else {
        return Response::json(array('flash' => 'senza projetti!'));
      }
    }
  }

  public function juzer_projects() {
    // Clockwork::startEvent('user.projects.get', 'User Projects Eager loading, Caching');

    if (Cache::has('tutti_projects')) {
      $projects = Cache::get('tutti_projects');
    } else {
      $projects = $this->project->with('client', 'tasks', 'juzers')->get();
      if ($projects->first()) {
        Cache::put('tutti_projects', $projects, 60);
      }
    }

    if (Cache::has(Request::segment(2).'_juzer_projects')) {
      $user_projects = Cache::get(Request::segment(2).'_juzer_projects');
    } else {
      $user_projects = $projects->filter(function($project)
      {
        if  ($project->juzers->filter(function($juzer)
            {
                    if ($juzer->id == Request::segment(2)) {   // Auth::user()->id
                        return true;
                    }
            })->count() > 0) 
        {
          return true;
        }
      });
      if ($user_projects->first()) {
        Cache::put(Request::segment(2).'_juzer_projects', $user_projects, 60);
      }
    }

    // Clockwork::endEvent('user.projects.get');

    if (Request::ajax())
    {
      // Clockwork::info($user_projects); 
      if ($user_projects) {
        return $user_projects;
      } else {
        return Response::json(array('flash' => 'senza projetti!'));
      }
    }
  }

  public function store() {
    // Clockwork::startEvent('project.create', 'create Project');

    $newproject = new Project;
    $newproject->client_id = Input::get('client_id');
    $newproject->name = Input::get('name');
    $creator = Auth::user();
    $newproject->created_by = $creator->id;

    /// validate...

    $newproject->save();
    $project_admin = Role::where('name', 'Project Admin')->first();
    if (!($creator->hasRole($project_admin->name))) {
      $creator->attachRole($project_admin);
    }
    $newproject->juzers()->attach($creator->id, array('admin' => 1));
    $jope = $this->project->with('client', 'tasks', 'juzers')->where('id', $newproject->id)->first();

    /// cache reset
    Tartalek::projects_cache_reset(strval($newproject->client_id), strval($creator->id));

    // Clockwork::endEvent('project.create');

    if (Request::ajax())
    {
      // Clockwork::info($newproject);
      // Clockwork::info($jope);
      return $jope;
    }
        
  }

  public function destroy($c_id, $p_id)
  {
    //
  }

}
