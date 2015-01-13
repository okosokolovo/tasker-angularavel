<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateTaggablesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('taggables', function(Blueprint $table) {
			// $table->increments('id');

			$table->integer('tag_id');
			$table->integer('taggables_id');
			$table->string('taggables_type');
			$table->primary(array('tag_id', 'taggables_id', 'taggables_type'));

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
		Schema::drop('taggables');
	}

}
