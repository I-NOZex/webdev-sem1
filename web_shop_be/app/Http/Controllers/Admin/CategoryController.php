<?php
namespace App\Http\Controllers\Admin;

use App\Models\Shop\Category;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return view('category.index', [
            'categories' => Category::all()
        ]);
    }

     public function create()
     {
         $model = new Category();
        return view('category.create');
     }

    public function store(Request $request)
    {
        //$request->validate([]);
        $data = $request->all();

        Category::create($data);

        return redirect()->route('categories.index')->with('success', 'Category Created Successfully!');
    }
    
    public function edit(Category $category)
    {
        return view('category.edit', compact('category'));
    }

    public function update(Request $request, Category $category)
    {
        //$request->validate([]);

        $data = $request->all();

        $category->update($data);

        return redirect()->route('categories.index')->with('success', 'Category Created Successfully!');
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return redirect()->route('categories.index')->with('success', 'Category Deleted Successfully!');
    }
}
