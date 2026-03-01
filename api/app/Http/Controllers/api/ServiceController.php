<?php

namespace App\Http\Controllers\api;

use App\Models\Service;

use App\Http\Resources\ServiceResource;

use App\Http\Requests\{
    ServiceStoreRequest,
    ServiceUpdateRequest
};

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        return ServiceResource::collection(
            Service::with('images')->latest('id')->get()
        );
    }

    public function show(Service $service)
    {
        $service->load(['images']);
        return new ServiceResource($service);
    }

    public function store(ServiceStoreRequest $request)
    {

        $data = $request->validated();
        unset($data['image']);
        $service = Service::create($data);

        foreach ($request->file('images') as $file)
            {
                $filename = $file->getClientOriginalName();
                $path = $file->store("service-cards-imgs/{$service->id}", 's3');

                $service->images()->create([
                    'image_name' => $filename,
                    'path' => $path
                ]);
            }
        $service->load(['images']);

        return (new ServiceResource($service))
            ->response()
            ->setStatusCode(201);
    }

    public function update(Service $service, ServiceStoreRequest $request)
    {
        $service->update($request->validated());

        return new ServiceResource($service);
    }

    public function destroy(Service $service)
    {
        Storage::disk('s3')->deleteDirectory("service-cards-imgs/{$service->id}");
        $service->delete();

        return response()->noContent();
    }
}
