<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Http\Requests\PaymentStoreRequest;

use App\Models\{
    Payment,
    Service
};

class PaymentController extends Controller
{
    public function index()
    {
        return Payment::query()
            ->with(['services', 'apartment'])
            ->orderByDesc('id')
            ->paginate(7);
    }

    public function show(Payment $payment)
    {
        return $payment->load(['services', 'apartment']);
    }

    public function store(PaymentStoreRequest $request)
    {
        $data = $request->validated();
        $serviceIds = $data['service_ids'] ?? [];
        unset($data['service_ids']);

        $payment = DB::transaction( function () use ($data, $serviceIds)
        {
            $total_price = Service::query()
                ->whereIn('id', $serviceIds)
                ->sum('price');

            $data['total_price'] = $total_price;
            $payment = Payment::create($data);

            if (!empty($serviceIds)) {
                $payment->services()->sync($serviceIds);
            }

            return $payment;
        });

        return response()->json(
            $payment->load(['services', 'apartment']),
            201
        );
    }

    public function destroy(Payment $payment)
    {
        DB::transaction(function () use ($payment) {
            $payment->services()->detach();
            $payment->delete();
        });

        return response()->noContent();
    }
}
