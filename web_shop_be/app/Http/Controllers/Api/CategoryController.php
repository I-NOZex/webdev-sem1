<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Shop\Category;
use App\Http\Controllers\Controller;
use App\Http\Controllers\ApiCRUDTrait;

class CategoryController extends Controller
{
    use ApiCRUDTrait;

    public function model()
    {
        return Category::class;
    }

}
