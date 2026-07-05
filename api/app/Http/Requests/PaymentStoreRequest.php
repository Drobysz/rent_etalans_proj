<?php

namespace App\Http\Requests;

use App\Models\Apartment;
use App\Models\Reservation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class PaymentStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'reservation_id' => ['nullable', 'integer', 'exists:reservations,id'],
            'reservation_code' => ['nullable', 'string', 'max:24'],
            'apart_id'      => ['nullable', 'integer', 'exists:apartments,id'],
            'checkin'       => ['nullable', 'date'],
            'checkout'      => ['nullable', 'date', 'after:checkin'],
            'session_id'    => ['required', 'string', 'min:0'],
            'client_number' => ['required', 'integer', 'min:1', 'max:20'],
            'days_number'   => ['required', 'integer', 'min:1', 'max:365'],
            'days_count'    => ['nullable', 'integer', 'min:1', 'max:365'],
            'email'         => ['required', 'email', 'max:80'],
            // 'reserve_id'    => ['required', 'string', 'max:20', 'unique,payments'],
            'reserve_id'    => ['required', 'string', 'max:20'],
            'total_price'   => ['required', 'numeric', 'min:0'],

            'service_ids'   => ['nullable', 'array'],
            'service_ids.*' => ['integer', 'exists:services,id']
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $roomsCount = $this->getRoomsCount();

            if (!$roomsCount) {
                return;
            }

            $maxGuests = $roomsCount === 1 ? 2 : 4;
            $guestCount = (int) $this->input('client_number', 0);

            if ($guestCount > $maxGuests) {
                $validator->errors()->add(
                    'client_number',
                    "The selected apartment allows up to {$maxGuests} guests."
                );
            }
        });
    }

    private function getRoomsCount(): ?int
    {
        $reservationId = $this->integer('reservation_id');

        if ($reservationId) {
            $reservation = Reservation::query()->find($reservationId);

            if ($reservation) {
                return (int) $reservation->rooms_count;
            }
        }

        $apartmentId = $this->integer('apart_id');

        if (!$apartmentId) {
            return null;
        }

        $apartment = Apartment::query()->find($apartmentId);

        return $apartment ? (int) $apartment->nb_chambers : null;
    }
}
