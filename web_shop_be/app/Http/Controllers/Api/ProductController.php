<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\ApiCRUDTrait;

use App\Models\Shop\Product;

class ProductController extends Controller
{
    use ApiCRUDTrait;

    public function model()
    {
        return Product::class;
    }
}
