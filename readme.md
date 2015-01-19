## Tasker

*Tasker* app is concieved as a collaboration tool for managing tasks. 

In brief, registered users with different permissions should track tasks organized in projects for selected clients. 

Solution approach presented by this repository includes several frameworks and packages, among which *[AngularJS](https://angularjs.org/)* stands out for front-end, and *[Laravel](http://laravel.com/)* for back-end. 

See the running [demo](http://tasker-angularavel.appspot.com/) or starting [chart](https://cloud.githubusercontent.com/assets/3195481/5749228/440360de-9c47-11e4-926e-fdb36e8d6c8a.jpg). 


#### Installation

Some experience with *Laravel*, *AngularJS*, *Bower* and *Grunt* is assumed. 

Presented code corresponds with deployment technique chosen for the demo app, which is via *Google App Engine* - *PHP Runtime Environment*. 

Apart from [GAE](https://cloud.google.com/appengine/docs/php/) documentation, [this](https://gae-php-tips.appspot.com/2013/10/22/getting-started-with-laravel-on-php-for-app-engine/) blog post served as a guide, and few steps from it are here separatelly illustrated with the file excerpts in `/gae` folder. 
These files actually reside under `/vendor` folder which results from Laravel installation (actual paths are commented at the top of illustration files). 
If choice of Laravel version is greater than 4.1, it is experienced that `/gae/MySqlConnector.php` patch is then not necessary. 

Some of dependencies require additional configuration, but for brevity, details of the processes are not explained here. Instead, final published config files are retained with placeholder remarks where to put parameters, and the best starting points for investigation are *package | bower | composer* `.json` files. 

For local testing without the GAE (that is, not with *Google App Engine Launcher* or `dev_appserver.py` development web server), Laravel original settings must be reverted. 

At the current state, main app view, assets and templates are located in corresponding `/public` locations, so that after downloading or cloning the code, installation at least means issuing `composer install` and introduction of aforementioned adaptations, as well as generating new app key with `php artisan key:generate`. 

Besides, database has to be created, included in `app.yaml` or `database.php`, and `php artisan migrate` issued to generate tables. Few test data seed files are prepared, and for that Laravel [documentation](http://laravel.com/docs/master/migrations#database-seeding) may be consulted. 

For the completion of front-end app code (`/tasker` folder) and for being able to run Grunt tasks, further steps are: `npm install` and `bower install`. 


#### Remarks

This work is in progress. During experimentation some parts are intentionally left inconsistent or with mixed techniques (e.g. validation). 

Google+ sign-in button renders properly in Chrome browser. 

All suggestions are welcome. 

Special credit for mentorship goes to [Maxa](http://www.makonda.com/).
