<!doctype html>
<html lang="" ng-app="tasker">
  <head>
    <base href="/">
    <meta charset="utf-8">
    <title>Tasker</title>
    <link rel="icon" href="favicon.ico">
    <link href="//fonts.googleapis.com/css?family=Faster+One" rel="stylesheet" type="text/css">
    <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/uvoz.css">
    <link rel="stylesheet" href="css/tasker.css">
    <!-- <link rel="stylesheet" href="css/font-awesome.min.css"> -->
    <meta name="viewport" content="width=device-width,initial-scale=1">
    [[-- <!--<meta name="token" content="[[ Session::token() ]]">--> --]]
    [[-- <!--<meta name="env" content="[[ App::environment() ]]">--> --]]

    <script>window.___gcfg = {lang: 'en-US'};</script>
    <script src="https://apis.google.com/js/client:platform.js" async defer></script>
    <script>
      window.___gcfg = {lang: 'en-US'};

      (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/client:plusone.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
      })();
    </script>
  </head>
  <body ng-cloak>
    <div class="jopajtas"></div>
    <div class="container-fluid" ng-controller="MainCtrl" ng-init="initPg()">
      
      <div ng-controller="AuthCtrl" ng-init="isAuthentic()">        
        
        <div class="navbar">
            <div class="navbar-header">
              <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse-1">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
              <a class="navbar-brand" ui-sref="home">Tasker</a>
            </div>
            
            <div class="collapse navbar-collapse" id="navbar-collapse-1">

              <ul class="nav navbar-nav" ng-show="loggedIn">
                <li id="client-select">
                  <a editable-select="client" 
                      onshow="loadClients()" 
                      buttons="no"
                      onaftersave="setCurrentId(client)"
                      e-ng-options="client.name for client in clients">
                      {{current.selectedClientName || 'select client'}}</a>
                </li>
                <li>
                  <a ui-sref="client.create">Create Client</a>
                </li>
              </ul>

              <ul class="nav navbar-nav">
                <li ui-sref-active="active">
                  <a ui-sref="home"><i class="fa fa-home"></i> home</a>
                </li>
                <li ng-class="{active: $state.is('about') || $state.is('more')}">
                  <a ui-sref="about"><i class="fa fa-beer"></i> about</a>
                </li>
              </ul>
                
              <ul class="nav navbar-nav navbar-right" >
                <li ng-show="loggedIn">
                  <div class="dropdown user-menu">
                    <a class="dropdown-toggle" data-toggle="dropdown">
                      <!-- <img id="av" ng-src="{{(loggedInUser.avatar.length > 0) ? '../uploads/usr/avatar/' + 'av_' + loggedInUser.avatar : ''}}"> -->
                      <img id="av" ng-src="{{(loggedInUser.avatar.length > 0) ? 'avatar/' + 'av_' + loggedInUser.avatar : ''}}">
                      <i ng-class="{'fa fa-user fa-2x': loggedInUser.avatar.length == 0}"></i>
                        {{loggedInUser.username}}
                    </a>
                    <ul class="dropdown-menu">
                      <li class="dropdown-header">Actions</li>
                      <li>
                        <!-- <a form-modal template="templates/users/edit_profile.html" title="Edit Profile" ok-button-text="Update Profile" form-errors="errors" form-clear="clear()" form-submit="update()" form-object="loggedInUser" tabindex="-1"><i class="fa fa-edit"></i> edit profile</a> -->
                        <a form-modal template="users/edit_profile.html" title="Edit Profile" ok-button-text="Update Profile" form-errors="errors" form-clear="clear()" form-submit="update()" form-object="loggedInUser" tabindex="-1"><i class="fa fa-edit"></i> edit profile</a>
                      </li>
                      <li>
                        <a ng-click="logout()" tabindex="-1">logout</a>
                      </li>
                      <li class="divider"></li>
                      <li class="dropdown-header">Options</li>
                      <li class="disabled">
                        <a tabindex="-1">option</a>
                      </li>
                    </ul>
                  </div>  <!-- dropdown -->
                </li>
                
                <li ng-hide="loggedIn">
                  <ul class="nav nav-pills">
                    <li class="dropdown zocial">
                      <a class="dropdown-toggle" data-toggle="dropdown">zocial login <span class="caret"></span></a>
                      <ul class="dropdown-menu">
                        <li>
                          <a ng-click="fblogin()" tabindex="-1">
                            <span class="sign"><i class="fa fa-2x fa-facebook-square"></i></span> <span class="opis">Sign in with Facebook</span>
                          </a>
                        </li>
                        <li>
                          <div id="signinButton"></div>
                        </li>
                        <li>
                          <a ng-click="twtlogin()" tabindex="-1">
                            <span class="sign"><i class="fa fa-2x fa-twitter-square"></i></span> <span class="opis">Sign in with Twitter</span>
                          </a>
                        </li>
                        <li>
                          <a ng-click="gitlogin()" tabindex="-1">
                            <span class="sign"><i class="fa fa-2x fa-github-square"></i></span> <span class="opis">Sign in with GitHub</span>
                          </a>
                        </li>
                        <li class="divider"></li>
                        <li class="disabled">
                          <a tabindex="-1">
                            <!-- <span class="sign"><img width="55" ng-src="assets/img/Jugoton.jpg"></span> <span class="opis">Jugoton</span> -->
                            <span class="sign"><img width="55" ng-src="img/Jugoton.jpg"></span> <span class="opis">Jugoton</span>
                          </a>
                        </li>
                        <li class="disabled">
                          <a tabindex="-1">
                            <span class="sign"><img width="55" ng-src="img/PGP-RTB.jpg"></span> <span class="opis">PGP-RTB</span>
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a id="longines" form-modal template="users/login.html" title="Login" ok-button-text="Login" form-errors="errors" form-clear="clear()" form-submit="login()" form-object="user">tasker login</a>
                    </li>
                    <li>
                      <a form-modal template="users/register.html" title="Register" form-errors="errors" form-clear="clear()" ok-button-text="Register" form-submit="register()" form-object="user">register</a>
                    </li>
                  </ul>
                </li>
              </ul>

            </div>  <!-- .nav-collapse -->
        </div>  <!-- .navbar -->

        <alert ng-repeat="alert in alerts" type="{{alert.type}}" close="alert.close()">{{alert.msg}}</alert>

        <p class="text-center" ng-show="loading"><span class="fa fa-cog fa-3x fa-spin"></span></p>

        <div class="row wkspc">
          <!-- <div class="wkspc-side" ng-show="loggedIn" ng-class="{col-md-2: loggedIn}"> -->
          <div class="wkspc-side" ng-show="loggedIn" ng-class="{'col-md-2': loggedIn}">
            <div>
              <h3>Users
                <div class="btn-group pull-right" ng-show="current.selectedClientName">
                  <button type="button" class="btn btn-inverse">Manage</button>
                  <button type="button" class="btn btn-inverse dropdown-toggle">
                    <span class="caret"></span>
                  </button>
                  <ul class="dropdown-menu">
                    <li class="dropdown-header">Manage Users</li>
                    <li class="disabled"><a tabindex="-1">Invite...</a></li> <!-- ui-sref / ng-click -->
                    <li class="disabled"><a tabindex="-1">Assign...</a></li> <!-- ui-sref / ng-click -->
                    <li class="divider"></li>
                    <li class="dropdown-header">Options</li>
                    <li class="disabled"><a tabindex="-1">option X</a></li>
                  </ul>
                </div>
              </h3>
              <div ui-view="users"></div>
            </div>
            <div ng-controller="ProjectsCtrl">
              <h3>Projects
                <span class="pull-right" ng-show="current.selectedClientName">
                  <span class="dropdown">
                    <a class="dropdown-toggle" tooltip="Manage Projects"><i class="fa fa-cog"></i></a>
                    <ul class="dropdown-menu">
                      <li>
                        <a ui-sref="projects.clientprojects">client projects</a>
                      </li>
                      <li>
                        <a ui-sref="projects.userprojects">my projects</a>
                      </li>
                      <li>
                        <a ui-sref="project.create"><i class="fa fa-plus-square"></i> create project</a>
                      </li>
                    </ul>
                  </span>
                </span>
              </h3>
              <div ui-view="projects"></div>
            </div>
          </div>
          
          <!-- <div class="wkspc-main" ng-class="{col-md-10: loggedIn, col-md-12: !loggedIn}"> -->
          <div class="wkspc-main" ng-class="{'col-md-10': loggedIn, 'col-md-12': !loggedIn}">
            
            <div ui-view></div>
            
            <div ui-view="abs"></div>
          </div>
        </div>

        <div class="via-zoclogin" id="o-auth" get-brutto-user>[[isset($brutto_user) ? $brutto_user : '']]</div>
        
      </div>  <!-- authCtrl-->

    </div>  <!-- .container-fluid / .mainCtrl -->

    <footer>
      <!-- <span class="visible-xs">SIZE XS</span>
      <span class="visible-sm">SIZE SM</span>
      <span class="visible-md">SIZE MD</span>
      <span class="visible-lg">SIZE LG</span> -->
    </footer>

    <script type="text/ng-template" id="create-client-modal.html">
      <div class="modal-dialog">
        <div class="modal-content">
          
          <div class="modal-header">
            <h3>Create Client</h3>
          </div>
          
          <form ng-submit="create()">
            <div class="modal-body">
              <fieldset>
                <div class="form-group">
                  <label for="name">name:</label>
                  <input type="text" class="form-control" id="name" name="name" ng-model="newclient.name" placeholder="enter client name" required>
                  <span class="help-block" ng-show="formErrors.name">{{formErrors.name}}</span>
                </div>
                <div class="form-group">
                  <label for="email">email:</label>
                  <input type="email" class="form-control" id="email" name="email" ng-model="newclient.email" placeholder="enter client email address" required>
                  <span class="help-block" ng-show="formErrors.email">{{formErrors.email}}</span>
                </div>
                <div class="form-group">
                  <label for="website">website (http:&#47;&#47;example.com):</label>
                  <input type="url" class="form-control" id="website" name="website" ng-model="newclient.website" placeholder="enter client website address">
                  <span class="help-block" ng-show="formErrors.website">{{formErrors.website}}</span>
                </div>
                <div class="form-group">
                  <label for="contact_person">contact person:</label>
                  <input type="text" class="form-control" id="contact_person" name="contact_person" ng-model="newclient.contact_person" placeholder="enter contact person name">
                  <span class="help-block" ng-show="formErrors.contact_person">{{formErrors.contact_person}}</span>
                </div>
              </fieldset>
            </div>

            <div class="modal-footer">
              <button class="btn btn-warning" ng-click="cancel()">Cancel</button>
              <input type="submit" class="btn btn-primary" value="Create">
            </div>
          </form>
        
        </div>
      </div>
    </script>

    [[--<!--<script src="[[asset('assets/js/uvoz.min.js')]]"></script>-->--]]
    <script src="js/uvoz.min.js"></script>
    [[--<!--<script src="[[asset('assets/js/tasker.js')]]"></script>-->--]]
    <script src="js/tasker.js"></script>
  </body>
</html>