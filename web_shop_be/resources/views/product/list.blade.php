@extends('layouts.master')

@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-md-3 py-5 px-3 col-lg-2 sidebar-filter bg-light border-right">
            <div class="mb-8">
                <img src="./logo.png" class="mx-auto d-block img-responsive">
            </div>
            <h3 class="mt-0 mb-4 mt-4">Showing <span class="text-primary">{{ $products->count() }}</span> Products</h3>
            <form action="{{ url('/products') }}" method="GET">
                <h6 class="text-uppercase font-weight-bold mb-3">Categories</h6>
                <div class="mt-2 mb-2 pl-2">
                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="category-1">
                        <label class="custom-control-label" for="category-1">Accessories</label>
                    </div>
                </div>
                <div class="mt-2 mb-2 pl-2">
                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="category-2">
                        <label class="custom-control-label" for="category-2">Coats &amp; Jackets</label>
                    </div>
                </div>
                <div class="mt-2 mb-2 pl-2">
                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="category-3">
                        <label class="custom-control-label" for="category-3">Hoodies &amp; Sweatshirts</label>
                    </div>
                </div>
                <div class="mt-2 mb-2 pl-2">
                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="category-4">
                        <label class="custom-control-label" for="category-4">Jeans</label>
                    </div>
                </div>
                <div class="mt-2 mb-2 pl-2">
                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="category-5">
                        <label class="custom-control-label" for="category-5">Shirts</label>
                    </div>
                </div>
                <div class="mt-2 mb-2 pl-2">
                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="category-6">
                        <label class="custom-control-label" for="category-6">Underwear</label>
                    </div>
                </div>

                <div class="divider mt-5 mb-5 border-bottom border-secondary"></div>
                <h6 class="text-uppercase mt-5 mb-3 font-weight-bold">Body</h6>
                @php
                    $bodyTypes = optional($products->first())->getBodyTypes() ?? [];
                @endphp
                @foreach($bodyTypes as $type)
                <div class="mt-2 mb-2 pl-2">
                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" {{request()->get('body_has') === [$type] ? 'checked' : ''}} id="filter-type-{{ $type }}" value="{{ $type }}" name="body_has[]">
                        <label class="custom-control-label" for="filter-type-{{ $type }}">{{ $type }}</label>
                    </div>
                </div>
                @endforeach

                <div class="divider mt-5 mb-5 border-bottom border-secondary"></div>
                <h6 class="text-uppercase mt-5 mb-3 font-weight-bold">Size</h6>
                @php
                    $sizes = optional($products->first())->getSizes() ?? [];
                @endphp
                @foreach($sizes as $size)
                <div class="mt-2 mb-2 pl-2">
                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" {{request()->get('sizes_has') === [$size] ? 'checked' : ''}} id="filter-size-{{ $size }}" value="{{ $size }}" name="sizes_has[]">
                        <label class="custom-control-label" for="filter-size-{{ $size }}">{{ $size }}</label>
                    </div>
                </div>
                @endforeach

                <div class="divider mt-5 mb-5 border-bottom border-secondary"></div>
                <h6 class="text-uppercase mt-5 mb-3 font-weight-bold">Price</h6>
                <div class="price-filter-control">
                    @php
                        $minPrice = request()->get('price_gte');
                        $maxPrice = request()->get('price_lte');
                    @endphp
                    <input type="number" class="form-control w-50 pull-left mb-2" id="price-min-control" name="price_gte[]" value="{{ !empty($minPrice) ? head($minPrice) : '' }}">
                    <input type="number" class="form-control w-50 pull-right" id="price-max-control" name="price_lte[]" value="{{ !empty($maxPrice) ? head($maxPrice) : '' }}">
                </div>
                <div class="divider mt-5 mb-5 border-bottom border-secondary"></div>
                <button type="submit" class="btn btn-lg btn-block btn-primary mt-5">Update Results</button>
            </form>
        </div>
        <div class="col-md-9 col-lg-10  mt-10 pt-10">
            <div class="container-fluid">
                <div class="row mb-5">
                    <div class="col-12">
                        <div class="dropdown text-md-left text-center float-md-left mb-3 mt-3 mt-md-0 mb-md-0">
                            <label class="mr-2">Sort by:</label>
                            <a class="btn btn-lg btn-light dropdown-toggle" data-toggle="dropdown" role="button"
                                aria-haspopup="true" aria-expanded="false">Relevance <span
                                    class="caret"></span></a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown" x-placement="bottom-start"
                                style="position: absolute; transform: translate3d(71px, 48px, 0px); top: 0px; left: 0px; will-change: transform;">
                                <a class="dropdown-item" href="products?sort=price&direction=desc">Price Descending</a>
                                <a class="dropdown-item" href="products?sort=price&direction=asc">Price Ascending</a>
                            </div>
                        </div>
                        <div class="btn-group float-md-right ml-3">
                            <button type="button" class="btn btn-lg btn-light"> <span class="fa fa-arrow-left"></span>
                            </button>
                            <button type="button" class="btn btn-lg btn-light"> <span class="fa fa-arrow-right"></span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="row">
                    @foreach ($products as $product)
                    <div class="col-6 col-md-6 col-lg-3 mb-3">
                        <div class="card h-100 border-0">
                            <div class="card-img-top">
                                <a href="{{ url('/products/'.$product->id.'') }}" class="font-weight-bold text-dark text-uppercase small">
                                <img src="https://via.placeholder.com/240x240/5fa9f8/efefef"
                                    class="img-fluid mx-auto d-block" alt="Card image cap" />
                                </a>
                            </div>
                            <div class="card-body text-center">
                                <h4 class="card-title">
                                    <a href="{{ url('/products/'.$product->id.'') }}" class="font-weight-bold text-dark text-uppercase small">
                                        {{ $product->name }}
                                    </a>
                                </h4>
                                <h5 class="card-price text-info">
                                    {{ $product->price }} kr.
                                </h5>
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
                <div class="row">
                 
                </div>
                <div class="row mb-2 mt-5">
                    <div class="col-4">
                        <a class="btn btn-light" href="#app"><i class="fas fa-arrow-up mr-2"></i> Back to top</a>

                    </div>

                    <div class="col">
                        <div class="d-flex justify-content-center">
                            {!! $products->withQueryString()->links() !!}
                        </div>                           
                    </div>
                    <div class="col-4">
                        <div class="btn-group float-md-right ml-3">
                            <button type="button" class="btn btn-lg btn-light"> <span class="fa fa-arrow-left"></span>
                            </button>
                            <button type="button" class="btn btn-lg btn-light"> <span
                                    class="fa fa-arrow-right"></span> </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    </div>
</div>
@endsection