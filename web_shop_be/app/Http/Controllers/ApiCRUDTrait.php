<?php
//origin: https://medium.com/@islemkms/creating-a-trait-that-simplifies-crud-operations-in-laravel-api-usage-674f54c8ef35
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

trait ApiCRUDTrait
{
    abstract function model();
    //abstract function validationRules($resource_id = 0);

    public function index()
    {
        return $this->model()::all();
    }

    public function create(Request $request)
    {
        Validator::make($request->all(), $this->validationRules())->validate();

        return $this->model()::create($request->all());
    }

    public function show($resource_id)
    {
        return $this->model()::findOrFail($resource_id);
    }

    public function update(Request $request, $resource_id)
    {
        $resource = $this->model()::findOrFail($resource_id);

        Validator::make($request->all(), $this->validationRules($resource_id))->validate();

        return $resource->update($request->all());
    }

    public function delete($resource_id)
    {
        $resource = $this->model()::findOrFail($resource_id);

        return $resource->delete();
    }
}