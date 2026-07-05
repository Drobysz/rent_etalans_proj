<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Http\Requests\PaymentStoreRequest;

use App\Models\{
    Payment,
    Reservation,
    Service
};

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $data = $request->validate([
            'reserve_id' => ['nullable', 'string', 'max:20'],
            'sort' => ['nullable', 'in:asc,desc'],
        ]);
        $reserveId = trim((string) ($data['reserve_id'] ?? ''));

        return Payment::query()
            ->with(['services', 'apartment', 'reservation.apartment'])
            ->when($reserveId !== '', function ($query) use ($reserveId) {
                $query->where(function ($nested) use ($reserveId) {
                    $nested
                        ->where('reserve_id', 'like', "%{$reserveId}%")
                        ->orWhere('reservation_code', 'like', "%{$reserveId}%")
                        ->orWhereHas('reservation', function ($reservationQuery) use ($reserveId) {
                            $reservationQuery->where('reservation_code', 'like', "%{$reserveId}%");
                        });
                });
            })
            ->orderBy('created_at', $data['sort'] ?? 'desc')
            ->paginate(7);
    }

    public function dashboard()
    {
        $now = CarbonImmutable::now();
        $weekStart = $now->startOfWeek();
        $monthStart = $now->startOfMonth();
        $yearStart = $now->startOfYear();

        return response()->json([
            'revenue' => [
                'week' => $this->revenueSince($weekStart),
                'month' => $this->revenueSince($monthStart),
                'year' => $this->revenueSince($yearStart),
            ],
            'orders' => [
                'week' => $this->ordersSince($weekStart),
                'month' => $this->ordersSince($monthStart),
                'year' => $this->ordersSince($yearStart),
            ],
            'series' => [
                'week' => $this->dailyRevenueSeries($weekStart, $weekStart->addDays(6)),
                'month' => $this->weeklyRevenueSeries($monthStart),
                'year' => $this->monthlyRevenueSeries($yearStart),
            ],
            'top_services' => $this->topServices(),
        ]);
    }

    public function show(Payment $payment)
    {
        return $payment->load(['services', 'apartment', 'reservation.apartment']);
    }

    public function store(PaymentStoreRequest $request)
    {
        $data = $request->validated();

        $existingPayment = Payment::where('session_id', $data['session_id'])->first();

        if ($existingPayment) {
            return response()->json([
               $existingPayment->load(['services', 'apartment', 'reservation.apartment']),
                'existed' => true,
            ]);
        }

        $reservation = null;

        if (!empty($data['reservation_id'])) {
            $reservation = Reservation::query()->find($data['reservation_id']);
        }

        if (!empty($data['checkin']) && !empty($data['checkout'])) {
            $checkin = CarbonImmutable::parse($data['checkin'])->startOfDay();
            $checkout = CarbonImmutable::parse($data['checkout'])->startOfDay();
            $daysCount = max(1, $checkin->diffInDays($checkout));

            $data['days_count'] = $daysCount;
            $data['days_number'] = $daysCount;
        } else {
            $data['days_count'] = $data['days_count'] ?? $data['days_number'];
        }

        if ($reservation) {
            $data['reservation_code'] = $reservation->reservation_code;
            $data['apart_id'] = $reservation->apart_id;
            $data['checkin'] = $reservation->checkin->toDateString();
            $data['checkout'] = $reservation->checkout->toDateString();
            $data['days_count'] = $reservation->days_count;
            $data['days_number'] = $reservation->days_count;
        }

        $serviceIds = $data['service_ids'] ?? [];
        unset($data['service_ids']);

        $payment = DB::transaction( function () use ($data, $serviceIds, $reservation)
        {
            $payment = Payment::create($data);

            if (!empty($serviceIds)) {
                $payment->services()->sync($serviceIds);
            }

            if ($reservation) {
                $reservation->forceFill(['status' => 'paid'])->save();
            }

            return $payment;
        });

        return response()->json([
                $payment->load(['services', 'apartment', 'reservation.apartment']),
                'existed' => false,
            ],
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

    private function revenueSince(CarbonImmutable $start): float
    {
        return (float) Payment::query()
            ->where('created_at', '>=', $start)
            ->sum('total_price');
    }

    private function ordersSince(CarbonImmutable $start): int
    {
        return Payment::query()
            ->where('created_at', '>=', $start)
            ->count();
    }

    /**
     * @return array<int, array{label: string, revenue: float}>
     */
    private function dailyRevenueSeries(CarbonImmutable $start, CarbonImmutable $end): array
    {
        $rows = Payment::query()
            ->where('created_at', '>=', $start)
            ->get(['created_at', 'total_price'])
            ->groupBy(fn (Payment $payment) => $payment->created_at->toDateString())
            ->map(fn ($payments) => $payments->sum('total_price'));

        $series = [];
        for ($date = $start; $date <= $end; $date = $date->addDay()) {
            $key = $date->toDateString();
            $series[] = [
                'label' => $date->format('d M'),
                'revenue' => (float) ($rows[$key] ?? 0),
            ];
        }

        return $series;
    }

    /**
     * @return array<int, array{label: string, revenue: float}>
     */
    private function weeklyRevenueSeries(CarbonImmutable $monthStart): array
    {
        $series = [];
        $monthEnd = $monthStart->endOfMonth();

        for ($week = 0; $week < 4; $week++) {
            $start = $monthStart->addWeeks($week)->startOfDay();
            $end = $week === 3
                ? $monthEnd->endOfDay()
                : $start->addDays(6)->endOfDay();

            $series[] = [
                'label' => 'Week ' . ($week + 1),
                'revenue' => (float) Payment::query()
                    ->whereBetween('created_at', [$start, $end])
                    ->sum('total_price'),
            ];
        }

        return $series;
    }

    /**
     * @return array<int, array{label: string, revenue: float}>
     */
    private function monthlyRevenueSeries(CarbonImmutable $start): array
    {
        $rows = Payment::query()
            ->where('created_at', '>=', $start)
            ->where('created_at', '<=', $start->endOfYear())
            ->get(['created_at', 'total_price'])
            ->groupBy(fn (Payment $payment) => $payment->created_at->format('Y-m'))
            ->map(fn ($payments) => $payments->sum('total_price'));

        $series = [];
        for ($date = $start; $date <= $start->endOfYear(); $date = $date->addMonth()) {
            $key = $date->format('Y-m');
            $series[] = [
                'label' => $date->format('M'),
                'revenue' => (float) ($rows[$key] ?? 0),
            ];
        }

        return $series;
    }

    /**
     * @return array<int, array{name: string, count: int, revenue: float}>
     */
    private function topServices(): array
    {
        return Service::query()
            ->select('services.name')
            ->selectRaw('COUNT(payment_history.payment_id) as count')
            ->selectRaw('COALESCE(SUM(services.price), 0) as revenue')
            ->join('payment_history', 'services.id', '=', 'payment_history.service_id')
            ->groupBy('services.id', 'services.name')
            ->orderByDesc('count')
            ->limit(5)
            ->get()
            ->map(fn (Service $service) => [
                'name' => $service->name,
                'count' => (int) $service->count,
                'revenue' => (float) $service->revenue,
            ])
            ->all();
    }
}
