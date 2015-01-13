<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateOwnerablesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('ownerables', function(Blueprint $table) {
			// $table->increments('id');

			$table->integer('user_id')->unsigned()->index();
			$table->integer('ownerables_id')->unsigned()->index();
			$table->string('ownerables_type')->index();
			$table->boolean('admin')->default(0);
			$table->boolean('tasker')->default(0);

			// $table->timestamps();
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('ownerables');
	}

}
