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
            ->with(['services'])
            ->orderByDesc('id')
            ->paginate(7);
    }

    public function show(Payment $payment)
    {
        return $payment->load(['services']);
    }

    public function store(PaymentStoreRequest $request)
    {
        $data = $request->validated();
        $serviceIds = $data['service_ids'] ?? [];
        unset($data['service_ids']);

        $payment = DB::transaction( function () use ($data, $serviceIds)
        {
            $payment = Payment::create($data);

            if (!empty($serviceIds)) {
                $payment->services()->sync($serviceIds);
            }

            return $payment;
        });

        return response()->json(
            $payment->load(['services']),
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
