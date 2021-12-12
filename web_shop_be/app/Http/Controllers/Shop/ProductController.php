<?php

namespace App\Http\Controllers\Shop;

use App\Models\Shop\Image;
use App\Models\Shop\Product;
use Illuminate\Http\Request;
use App\Models\Shop\Category;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Schema;

class ProductController extends Controller
{
    public function index(Request $request)
    {

        $operationsMap = [
            'lt' => '<',
            'lte' => '<=',
            'gt' => '>',
            'gte' => '>=',
            'like' => 'like',
            'has' => 'has'
        ];

        $products = Product::sortable()->where('state', '=', 'Available');

        $categories = Category::all();


        $queryStrings = $request->all();

        foreach ($queryStrings as $field => $values) {
            preg_match('/^(?<field>\w+)_(?<operator>lte|gte|lt|gt|like|has){1}/', $field, $match);
            
            app('debugbar')->info($field);
            app('debugbar')->warning($values);
            app('debugbar')->warning($match);

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


        if ($request->has('age_more_than')) {
            $products->where('age', '>', $request->age_more_than);
        }

        if ($request->has('gender')) {
            $products->where('gender', $request->gender);
        }

        if ($request->has('created_at')) {
            $products->where('created_at','>=', $request->created_at);
        }

        return view('product.list', [
            'products' => $products->paginate(4),
            'categories' => $categories,
            'enums' => Product::class,
        ]);
    }  
/* 
     public function create()
     {
         $model = new Product();
        return view('product.create', [
            'enum' => [
                'sizes' => $model->getSizes(),
                'body' => $model->getBodyTypes(),
                'states' => $model->getStates(),
            ]
        ]);
     }

    public function store(Request $request)
    {
        //$request->validate([]);
        $data = $request->all();
        $data['body'] = implode(",", $data['body']);
        $data['sizes'] = implode(",", $data['sizes']);

        Product::create($data);

        return redirect()->route('products.index')->with('success', 'Product Created Successfully!');
    }*/

    public function show(Product $product)
    {
        if($product->state === 'Available')
            return view('product.show', compact('product'));
            else return abort(404);
    }

    /*public function edit(Product $product)
    {
        return view('product.edit', compact('product'));
    }

    public function update(Request $request, Product $product)
    {
        //$request->validate([]);

        $data = $request->all();
        $data['body'] = implode(",", $data['body']);
        $data['sizes'] = implode(",", $data['sizes']);

        $product->update($data);

        return redirect()->route('products.index')->with('success', 'Product Created Successfully!');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product Deleted Successfully!');
    } */
}
