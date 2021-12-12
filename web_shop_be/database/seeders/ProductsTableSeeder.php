<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductsTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        DB::table('products')->delete();
        
        DB::table('products')->insert(array (
            0 => 
            array (
                'id' => 1,
                'sizes' => 'Teen,S,M,L,XL',
                'body' => 'Male,Female',
                'state' => 'Available',
                'price' => '19.99',
                'created_at' => '2021-12-12 20:58:05',
                'updated_at' => '2021-12-12 20:58:05',
                'name' => 'First product',
            ),
            1 => 
            array (
                'id' => 2,
                'sizes' => 'Teen,M',
                'body' => 'Male,Female',
                'state' => 'Archived',
                'price' => '99.99',
                'created_at' => '2021-12-12 20:59:07',
                'updated_at' => '2021-12-12 20:59:07',
                'name' => 'Archived Product',
            ),
            2 => 
            array (
                'id' => 3,
                'sizes' => 'M,L',
                'body' => 'Male',
                'state' => 'Available',
                'price' => '26.49',
                'created_at' => '2021-12-12 21:01:03',
                'updated_at' => '2021-12-12 21:01:03',
                'name' => 'Sweat shirt',
            ),
            3 => 
            array (
                'id' => 4,
                'sizes' => 'M,L,XL',
                'body' => 'Male',
                'state' => 'Available',
                'price' => '16.99',
                'created_at' => '2021-12-12 21:02:02',
                'updated_at' => '2021-12-12 21:02:02',
                'name' => 'T-shirt Male',
            ),
        ));
        
        
    }
}