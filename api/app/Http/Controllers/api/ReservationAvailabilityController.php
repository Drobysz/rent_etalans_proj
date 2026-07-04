<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\BlockedDate;
use App\Models\Payment;
use App\Models\Reservation;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;

class ReservationAvailabilityController extends Controller
{
    public function index(Request $request)
    {
        $data = $request->validate([
            'apartment_id' => ['nullable', 'integer', 'exists:apartments,id'],
        ]);

        $blockedDates = $this->getBlockedDates();
        $reservedDates = $this->getReservedDates($data['apartment_id'] ?? null);
        $disabledDates = collect([...$blockedDates, ...$reservedDates])
            ->unique()
            ->sort()
            ->values()
            ->all();

        return response()->json([
            'disabled_dates' => $disabledDates,
            'blocked_dates' => $blockedDates,
            'reserved_dates' => $reservedDates,
        ]);
    }

    public function blockedDates()
    {
        return BlockedDate::query()
            ->orderBy('start_date')
            ->get(['id', 'date', 'start_date', 'end_date', 'reason']);
    }

    public function block(Request $request)
    {
        $data = $request->validate([
            'date' => ['nullable', 'date'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'reason' => ['nullable', 'string', 'max:120'],
        ]);

        $startDate = $data['start_date'] ?? $data['date'] ?? null;
        $endDate = $data['end_date'] ?? $startDate;

        if (!$startDate) {
            return response()->json([
                'message' => 'A start date is required.',
            ], 422);
        }

        $normalizedStart = CarbonImmutable::parse($startDate)->toDateString();
        $normalizedEnd = CarbonImmutable::parse($endDate)->toDateString();

        $blockedDate = BlockedDate::query()->updateOrCreate(
            ['date' => $normalizedStart],
            [
                'start_date' => $normalizedStart,
                'end_date' => $normalizedEnd,
                'reason' => $data['reason'] ?? null,
            ],
        );

        return response()->json($blockedDate, 201);
    }

    public function unblock(string $range)
    {
        if (ctype_digit($range)) {
            BlockedDate::query()->whereKey((int) $range)->delete();

            return response()->noContent();
        }

        $normalizedDate = CarbonImmutable::parse($range)->toDateString();

        BlockedDate::query()
            ->whereDate('date', $normalizedDate)
            ->orWhereDate('start_date', $normalizedDate)
            ->delete();

        return response()->noContent();
    }

    private function getBlockedDates(): array
    {
        return BlockedDate::query()
            ->orderBy('start_date')
            ->get(['date', 'start_date', 'end_date'])
            ->flatMap(function (BlockedDate $blockedDate) {
                return $this->expandDateRange(
                    $blockedDate->start_date ?? $blockedDate->date,
                    $blockedDate->end_date ?? $blockedDate->date,
                    true,
                );
            })
            ->unique()
            ->sort()
            ->values()
            ->all();
    }

    private function getReservedDates(?int $apartmentId): array
    {
        $paymentDates = Payment::query()
            ->whereNotNull('checkin')
            ->whereNotNull('checkout')
            ->when($apartmentId, fn ($query) => $query->where('apart_id', $apartmentId))
            ->get(['checkin', 'checkout'])
            ->flatMap(fn (Payment $payment) => (
                $this->expandDateRange($payment->checkin, $payment->checkout)
            ));

        $reservationDates = Reservation::query()
            ->whereIn('status', ['pending', 'paid'])
            ->when($apartmentId, fn ($query) => $query->where('apart_id', $apartmentId))
            ->get(['checkin', 'checkout'])
            ->flatMap(fn (Reservation $reservation) => (
                $this->expandDateRange($reservation->checkin, $reservation->checkout)
            ));

        return $paymentDates
            ->merge($reservationDates)
            ->unique()
            ->sort()
            ->values()
            ->all();
    }

    private function expandDateRange($start, $end, bool $includeEnd = false): array
    {
        $dates = [];
        $date = CarbonImmutable::parse($start)->startOfDay();
        $lastDate = CarbonImmutable::parse($end)->startOfDay();

        while ($includeEnd ? $date <= $lastDate : $date < $lastDate) {
            $dates[] = $date->toDateString();
            $date = $date->addDay();
        }

        return $dates;
    }
}
