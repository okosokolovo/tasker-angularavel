<?php

class ClientsController extends BaseController {


    protected $client;

    public function __construct(Client $client)
    {
        $this->client = $client;
    }


    public function index()
    {
        // Clockwork::startEvent('clients.get', 'Clients Eager loading, Caching');

        if (Cache::has('tutti_clients')) {
            $clients = Cache::get('tutti_clients');
        } else {
            $clients = Client::with('projects', 'juzers')->get();
            foreach ($clients as $client) {
                $client->projects_count = $client->projects->count();   //not used for now
            }
            if ($clients->first()) {
                Cache::put('tutti_clients', $clients, 60);
            }
        }

        // Clockwork::endEvent('clients.get');
        if (Request::ajax())
        {
            // Clockwork::info($clients);
            return Response::json($clients);
        }
    }


    public function juzer_clients()
    {
        ///// no cache:
        // Clockwork::startEvent('clients.get', 'Clients for user Eager loading');
        // $klijenti = $this->client->with('projects', 'juzers')->get();
        // $user_clients = $klijenti->filter(function($klijent) 
        // {
        //     if ($klijent->juzers->filter(function($juzer)
        //     {
        //         if($juzer->id == Request::segment(2)) {
        //             return true;
        //         }
        //     })->count() > 0) {
        //         return true;
        //     }
        // });

        ///// cache:
        // Clockwork::startEvent('clients.get', 'Clients for user Eager loading, Caching');
        if (Cache::has('tutti_clients')) {
            $klijenti = Cache::get('tutti_clients');
        } else {
            $klijenti = $this->client->with('projects', 'juzers')->get();
            if ($klijenti->first()) {
                Cache::put('tutti_clients', $klijenti, 60);
            }
        }
        if (Cache::has(Request::segment(2).'_juzer_clients')) {
            $user_clients = Cache::get(Request::segment(2).'_juzer_clients');
        } else {
            $user_clients = $klijenti->filter(function($klijent)
            {
                if ($klijent->juzers->filter(function($juzer)
                {
                    if($juzer->id == Request::segment(2)) {
                        return true;
                    }
                })->count() > 0) {
                return true;
                }
            });
            if ($user_clients->first()) {
                Cache::put(Request::segment(2).'_juzer_clients', $user_clients, 60);
            }
        }

        // Clockwork::endEvent('clients.get');
        if (Request::ajax()) {
            // Clockwork::info($user_clients);
            return $user_clients;
        }
    }


    public function store()
    {
        // Clockwork::startEvent('client.create', 'Create client');
        $input = Input::all();

        /// validate...

        $newclient = $this->client->create($input);
        $creator = Auth::user();
        $newclient->created_by = $creator->id;
        $newclient->save();

        if (Cache::has('tutti_clients')) {
            Cache::forget('tutti_clients');
        }
        if (Cache::has(strval($creator->id) . '_juzer_clients')) {
            Cache::forget(strval($creator->id) . '_juzer_clients');
        }

        $client_admin = Role::where('name', 'Client Admin')->first();
        if (!($creator->hasRole($client_admin->name))) {
            $creator->attachRole($client_admin);
        }
        $newclient->juzers()->attach($creator->id, array('admin' => 1));
        $jope = $this->client->with('projects', 'juzers')->where('id', $newclient->id)->first();

        // Clockwork::endEvent('client.create');
        if (Request::ajax())
        {
            // Clockwork::info($newclient);
            // Clockwork::info($jope);
            return $jope;
        }
    }


    public function show($id)
    {
        
        //
    }


    public function update($id)
    {
        //
    }


    public function destroy($id)
    {
        //
    }

}
