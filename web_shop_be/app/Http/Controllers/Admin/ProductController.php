<?php
namespace App\Http\Controllers\Admin;

use App\Models\Shop\Product;
use Illuminate\Http\Request;
use App\Models\Shop\Category;
use App\Http\Controllers\Controller;

class ProductController extends Controller
{
    public function index()
    {
        return view('product.index', [
            'products' => Product::latest()->get()
        ]);
    }

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
    }

    public function show(Product $product)
    {
        return view('product.show', compact('product'));
    }

    public function edit(Product $product)
    {
        return view('product.edit', [
            'product' => $product,
            'categories' => Category::all()
        ]);
    }

    public function update(Request $request, Product $product)
    {
        //$request->validate([]);

        $data = $request->all();
        $data['body'] = implode(",", $data['body']);
        $data['sizes'] = implode(",", $data['sizes']);

        
        $product->update($data);

        if(!empty($request->categories )) {
            foreach ($request->categories as $categoryId) {
                $product->categories()->syncWithoutDetaching($categoryId);
            }
        }

        return redirect()->route('products.index')->with('success', 'Product Created Successfully!');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product Deleted Successfully!');
    }
}
