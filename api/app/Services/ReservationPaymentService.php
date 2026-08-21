<?php

namespace App\Services;

use App\Models\Reservation;
use Illuminate\Support\Facades\DB;
use Stripe\Checkout\Session;

class ReservationPaymentService
{
    public function confirm(Session $session): ?Reservation
    {
        if ($session->payment_status !== 'paid') {
            return null;
        }

        return $this->updateReservation($session, Reservation::STATUS_PAID);
    }

    public function markIncomplete(Session $session, string $status): ?Reservation
    {
        if (! in_array($status, [
            Reservation::STATUS_EXPIRED,
            Reservation::STATUS_PAYMENT_FAILED,
        ], true)) {
            return null;
        }

        return $this->updateReservation($session, $status, false);
    }

    private function updateReservation(
        Session $session,
        string $status,
        bool $mayUpdatePaid = true,
    ): ?Reservation {
        $reservationId = (int) ($session->metadata?->reservation_id ?? 0);

        if (! $reservationId) {
            return null;
        }

        return DB::transaction(function () use ($reservationId, $session, $status, $mayUpdatePaid) {
            $reservation = Reservation::query()
                ->lockForUpdate()
                ->find($reservationId);

            if (! $reservation) {
                return null;
            }

            if (
                $reservation->stripe_session_id
                && $reservation->stripe_session_id !== $session->id
            ) {
                return null;
            }

            if (
                ! $mayUpdatePaid
                && in_array($reservation->status, Reservation::OCCUPYING_STATUSES, true)
            ) {
                return $reservation;
            }

            $reservation->forceFill([
                'stripe_session_id' => $session->id,
                'status' => $status,
            ])->save();

            return $reservation->fresh();
        });
    }
}
