<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ImagesTableSeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        

        DB::table('images')->delete();
        
        DB::table('images')->insert(array (
            0 => 
            array (
                'id' => 1,
                'product_id' => 1,
                'created_at' => '2021-12-12 20:58:05',
                'updated_at' => '2021-12-12 20:58:05',
                'name' => '1639342685_bg_avatar.png',
                'file_path' => '/storage/uploads/1639342685_bg_avatar.png',
            ),
            1 => 
            array (
                'id' => 2,
                'product_id' => 2,
                'created_at' => '2021-12-12 20:59:07',
                'updated_at' => '2021-12-12 20:59:07',
                'name' => '1639342747_alpha_background.gif',
                'file_path' => '/storage/uploads/1639342747_alpha_background.gif',
            ),
            2 => 
            array (
                'id' => 3,
                'product_id' => 3,
                'created_at' => '2021-12-12 21:01:03',
                'updated_at' => '2021-12-12 21:01:03',
                'name' => '1639342863_hand_avatar.png',
                'file_path' => '/storage/uploads/1639342863_hand_avatar.png',
            ),
            3 => 
            array (
                'id' => 4,
                'product_id' => 4,
                'created_at' => '2021-12-12 21:02:02',
                'updated_at' => '2021-12-12 21:02:02',
                'name' => '1639342922_image1.png',
                'file_path' => '/storage/uploads/1639342922_image1.png',
            ),
        ));
        
        
    }
}