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
            Service::with(['images', 'descriptions'])->latest('id')->get()
        );
    }

    public function show(Service $service)
    {
        $service->load(['images', 'descriptions']);
        return new ServiceResource($service);
    }

    public function showAllVisible()
    {
        return ServiceResource::collection(
            Service::with(['images', 'descriptions'])
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
        $descriptions = $data['descriptions'];
        unset($data['images']);
        unset($data['descriptions']);

        try {
            $service = DB::transaction(function () use ($data, $files, $descriptions, &$uploadedPaths) {
                $service = Service::create($data);

                $this->syncDescriptions($service, $descriptions);

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

        $service->load(['images', 'descriptions']);

        return (new ServiceResource($service))
            ->response()
            ->setStatusCode(201);
    }

    public function update(Service $service, ServiceUpdateRequest $request)
    {
        $data = $request->validated();
        $descriptions = $data['descriptions'] ?? null;
        unset($data['descriptions']);

        DB::transaction(function () use ($service, $data, $descriptions) {
            $service->update($data);

            if ($descriptions !== null) {
                $this->syncDescriptions($service, $descriptions);
            }
        });

        $service->load(['images', 'descriptions']);

        return new ServiceResource($service);
    }

    public function destroy(Service $service)
    {
        Storage::disk('s3')->deleteDirectory("service-cards-imgs/{$service->id}");
        $service->delete();

        return response()->noContent();
    }

    /**
     * @param array<string, string> $descriptions
     */
    private function syncDescriptions(Service $service, array $descriptions): void
    {
        foreach (['en', 'fr', 'de'] as $locale) {
            $service->descriptions()->updateOrCreate(
                ['locale' => $locale],
                ['description' => $descriptions[$locale]]
            );
        }
    }
}
