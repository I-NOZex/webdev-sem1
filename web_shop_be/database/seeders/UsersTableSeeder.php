<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsersTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        DB::table('users')->delete();
        
        DB::table('users')->insert(array (
            0 => 
            array (
                'id' => 1,
                'name' => 'Tiago',
                'email' => 'tfm@mail.com',
                'email_verified_at' => '2021-12-02 15:47:24',
                'password' => '$2y$10$MT9lhh0aB1/Jo2iDAyteuO7wB/qjEnwEYQ1BuypRrNwSzyL8vsHhS',
                'remember_token' => '2ZLshzFJWPGBQrk7nOvA0ebsJ0ZePjcJ4vcPcvul9t9WpFndw3lHZp9Jjign',
                'created_at' => '2021-12-02 15:47:24',
                'updated_at' => '2021-12-02 15:47:24',
            ),
        ));
        
        
    }
}