<?php
namespace App\Http\Controllers\Admin;

use App\Models\Shop\Image;
use App\Models\Shop\Product;
use Illuminate\Http\Request;
use App\Models\Shop\Category;
use App\Http\Controllers\Controller;

class ProductController extends Controller
{
    public function index()
    {
        return view('product.index', [
            'products' => Product::latest()->get(),
        ]);
    }

     public function create()
     {
         $model = new Product();
        return view('product.create', [
            'categories' => Category::all(),
            'enum' => [
                'sizes' => $model->getSizes(),
                'body' => $model->getBodyTypes(),
                'states' => $model->getStates(),
            ]
        ]);
     }

    public function store(Request $request)
    {
        $request->validate(Product::$rules);

        $data = $request->all();
        $data['body'] = implode(",", $data['body']);
        $data['sizes'] = implode(",", $data['sizes']);

        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);
        
        $new_product = Product::create($data);
        $this->imageUpload($request, $new_product->id);

        if(!empty($request->categories )) {
            foreach ($request->categories as $categoryId) {
                $new_product->categories()->syncWithoutDetaching($categoryId);
            }
        }

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

        $this->imageUpload($request, $product->id);

        if(!empty($request->categories )) {
            foreach ($request->categories as $categoryId) {
                $product->categories()->syncWithoutDetaching($categoryId);
            }
        }

        return redirect()->route('products.index')->with('success', 'Product Created Successfully!');
    }

    public function imageUpload(Request $req, $product_id){
        $req->validate([
        'file' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $imageModel = new Image;

        if($req->file()) {
            $fileName = time().'_'.$req->file->getClientOriginalName();
            $filePath = $req->file('file')->storeAs('uploads', $fileName, 'public');

            $imageModel->name = time().'_'.$req->file->getClientOriginalName();
            $imageModel->file_path = '/storage/' . $filePath;
            $imageModel->product_id = $product_id;
            $imageModel->save();

            return back()
            ->with('success','File has been uploaded.')
            ->with('file', $fileName);
        }
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product Deleted Successfully!');
    }
}
