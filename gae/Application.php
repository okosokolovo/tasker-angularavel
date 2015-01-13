<!-- /vendor/laravel/framework/src/Illuminate/Foundation/Application.php -->

<?php namespace Illuminate\Foundation;

#
#...
#

class Application extends Container implements HttpKernelInterface, TerminableInterface, ResponsePreparerInterface {

#
#...
#

	///original///
	// public function bindInstallPaths(array $paths)
	// {
	// 	$this->instance('path', realpath($paths['app']));

	// 	// Here we will bind the install paths into the container as strings that can be
	// 	// accessed from any point in the system. Each path key is prefixed with path
	// 	// so that they have the consistent naming convention inside the container.
	// 	foreach (array_except($paths, array('app')) as $key => $value)
	// 	{
	// 		$this->instance("path.{$key}", realpath($value));
	// 	}
	// }
	//////
	
	//GAE:
	public function bindInstallPaths(array $paths)
	{
    if (realpath($paths['app'])) {
        $this->instance('path', realpath($paths['app']));
    }
    elseif (file_exists($paths['app'])) {
        $this->instance('path', $paths['app']);
    }
    else {
        $this->instance('path', FALSE);
    }

    foreach (array_except($paths, array('app')) as $key => $value)
    {
        if (realpath($value)) {
            $this->instance("path.{$key}", realpath($value));
        }
        elseif (file_exists($value)) {
            $this->instance("path.{$key}", $value);
        }
        else {
            $this->instance("path.{$key}", FALSE);
        }
    }
	}

#
#...
#...
#

}
