<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductsHasCategoriesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        DB::table('products_has_categories')->delete();
        
        DB::table('products_has_categories')->insert(array (
            0 => 
            array (
                'product_id' => 2,
                'category_id' => 1,
            ),
            1 => 
            array (
                'product_id' => 1,
                'category_id' => 3,
            ),
            2 => 
            array (
                'product_id' => 2,
                'category_id' => 3,
            ),
            3 => 
            array (
                'product_id' => 4,
                'category_id' => 3,
            ),
            4 => 
            array (
                'product_id' => 3,
                'category_id' => 4,
            ),
        ));
        
        
    }
}