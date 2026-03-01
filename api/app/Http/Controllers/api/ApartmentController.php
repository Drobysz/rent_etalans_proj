<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\{
    ApartmentStoreRequest,
    ApartmentUpdateRequest
};
use App\Models\Apartment;
use App\Http\Resources\ApartmentResource;
use Illuminate\Http\Response;

use Illuminate\Support\Facades\Storage;

class ApartmentController extends Controller
{
    public function index()
    {
        return ApartmentResource::collection(
            Apartment::with('images')->latest('id')->paginate(15)
        );
    }

    public function show(Apartment $apartment)
    {
        $apartment->load(['images']);
        return new ApartmentResource($apartment);
    }

    public function store(ApartmentStoreRequest $request)
    {
        $data = $request->validated();
        unset($data['images']);
        $apartment = Apartment::create($data);

        if ($request->hasFile('images'))
        {
            foreach ($request->file('images') as $file)
            {
                $filename = $file->getClientOriginalName();
                $path = $file->store("apart-imgs/{$apartment->id}", 's3');

                $apartment->images()->create([
                    'image_name' => $filename,
                    'path' => $path
                ]);
            }
        }

        $apartment->load(['images']);

        return (new ApartmentResource($apartment))
            ->response()
            ->setStatusCode(201);
    }

    public function update(ApartmentUpdateRequest $request, Apartment $apartment)
    {
        $apartment->update($request->validated());

        return new ApartmentResource($apartment);
    }

    public function destroy(Apartment $apartment)
    {
        Storage::disk('s3')->deleteDirectory("apart-imgs/{$apartment->id}");
        $apartment->delete();

        return response()->noContent();
    }
}
