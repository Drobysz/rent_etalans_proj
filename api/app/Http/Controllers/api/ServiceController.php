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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Throwable;

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

    public function showAllVisible()
    {
        return ServiceResource::collection(
            Service::with('images')
                ->where('visible', true)
                ->latest('id')
                ->get()
        );
    }

    public function store(ServiceStoreRequest $request)
    {
        $data = $request->validated();
        $files = $request->file('images', []);
        $uploadedPaths = [];
        unset($data['images']);

        try {
            $service = DB::transaction(function () use ($data, $files, &$uploadedPaths) {
                $service = Service::create($data);

                foreach ($files as $file) {
                    $filename = $file->getClientOriginalName();
                    $path = $file->store("service-cards-imgs/{$service->id}", 's3');

                    if (!$path) {
                        throw new RuntimeException('Service image was not uploaded.');
                    }

                    $uploadedPaths[] = $path;

                    $service->images()->create([
                        'image_name' => $filename,
                        'path' => $path
                    ]);
                }

                return $service;
            });
        } catch (Throwable $e) {
            foreach ($uploadedPaths as $path) {
                Storage::disk('s3')->delete($path);
            }

            throw $e;
        }

        $service->load(['images']);

        return (new ServiceResource($service))
            ->response()
            ->setStatusCode(201);
    }

    public function update(Service $service, ServiceUpdateRequest $request)
    {
        $service->update($request->validated());
        $service->load(['images']);

        return new ServiceResource($service);
    }

    public function destroy(Service $service)
    {
        Storage::disk('s3')->deleteDirectory("service-cards-imgs/{$service->id}");
        $service->delete();

        return response()->noContent();
    }
}
