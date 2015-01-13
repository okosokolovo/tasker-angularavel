<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class ConfideSetupUsersTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        #confide
        // Creates the users table
        // Schema::create('users', function($table)
        // {
        //     $table->increments('id');
        //     $table->string('username');
        //     $table->string('email');
        //     $table->string('password');
        //     $table->string('confirmation_code');
        //     $table->boolean('confirmed')->default(false);
        //     $table->timestamps();
        // });

        #mine
        Schema::table('users', function(Blueprint $table) {
            $table->string('confirmation_code');
            $table->boolean('confirmed')->default(false);
        });

        #confide
        // Creates password reminders table
        // Schema::create('password_reminders', function($t)
        // {
        //     $t->string('email');
        //     $t->string('token');
        //     $t->timestamp('created_at');
        // });

        #mine
        Schema::create('password_reminders', function(Blueprint $table)
        {
            $table->string('email');
            $table->string('token');
            $table->timestamp('created_at');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Schema::drop('users');
        Schema::drop('password_reminders');

        #mine
        Schema::table('users', function(Blueprint $table) {
            $table->dropColumn('confirmation_code', 'confirmed');
        });
    }

}
