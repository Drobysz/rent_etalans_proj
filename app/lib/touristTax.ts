export const TOURIST_TAX_PER_GUEST_PER_NIGHT = 1.2;

export function calculateTouristTax(guests: number, nights: number) {
  return Math.round(
    TOURIST_TAX_PER_GUEST_PER_NIGHT * Math.max(guests, 0) * Math.max(nights, 0) * 100,
  ) / 100;
}
