<?php

namespace App\Http\Controllers\Api;

use App\Models\Shop\Product;
use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\Http\Controllers\ApiCRUDTrait;
use Illuminate\Support\Facades\Schema;

class ProductController extends Controller
{
    use ApiCRUDTrait;

    public function model()
    {
        return Product::class;
    }

    public function index(Request $request)
    {
        //return response()->json(Product::latest()->where('state', '=', 'Available')->get());

        $operationsMap = [
            'lt' => '<',
            'lte' => '<=',
            'gt' => '>',
            'gte' => '>=',
            'like' => 'like',
            'has' => 'has'
        ];

        $products = Product::sortable()->where('state', '=', 'Available');

        $queryStrings = $request->all();

        foreach ($queryStrings as $field => $values) {
            preg_match('/^(?<field>\w+)_(?<operator>lte|gte|lt|gt|like|has){1}/', $field, $match);

            if( !empty($match) ) {
                if( Schema::hasColumn('products', $match['field']) ) {
                    if(is_array($values)) {
                        $products->where(function ($q) use ($values, $match, $operationsMap) {
                            foreach($values as $val) {
                                if(empty($val)) continue;
    
                                if($match['operator'] === 'has') {
                                    $q->orWhereRaw("FIND_IN_SET('{$val}',{$match['field']})");
                                } else {
                                    $q->orWhere($match['field'], $operationsMap[$match['operator']], $val);
                                }
                            }
                        });
                    }
                }

            } else if( Schema::hasColumn('products', $field) ) {
                if(is_array($values))
                    $products->whereIn($field, array_values($values));
                else
                    $products->where($field, $values);
            } else if ( $field === 'categories' ) {
                if(is_array($values))
                    $products->whereHas($field, fn ($query) => 
                        $query->whereIn('id', array_values($values))
                    );
                else
                    $products->whereHas($field, fn ($query) => 
                        $query->where('id', $values)
                    );
            }
        }

        return response()
            ->json($products->get())
            ->header('Access-Control-Expose-Headers', 'X-Count,X-Min-Price,X-Max-Price')
            ->header('X-Count', $products->count())
            ->header('X-Min-Price', Product::min('price'))
            ->header('X-Max-Price', Product::max('price'))
            ;
    }
}
