<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        DB::table('categories')->delete();
        
        DB::table('categories')->insert(array (
            0 => 
            array (
                'id' => 1,
                'name' => 'Hoodies',
            ),
            1 => 
            array (
                'id' => 3,
                'name' => 'T-Shirts',
            ),
            2 => 
            array (
                'id' => 4,
                'name' => 'Sweats',
            ),
        ));
        
        
    }
}