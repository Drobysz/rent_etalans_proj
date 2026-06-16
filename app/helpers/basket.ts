import { Service, ServicesOrderParams } from "@/types";
type TranslateFn = (key: string) => string;

export class BasketService {
    static getChosenServices(
        params: ServicesOrderParams,
        services: Service[]
    ) {
        const chosenIds = params.services_ids;

        return services?.filter(s => chosenIds.includes(s.id))
    }

    static getMultiplier (params: ServicesOrderParams) {
        return Number(params.days_count) * Number(params.visitors_count);
    }

    static getTotalPrice (
        params: ServicesOrderParams,
        services: Service[]
    ) {
        const TOTAL_MULTIPLIER = params.days_count * params.visitors_count;

        return services
            .map(svc=> svc.fixed_price 
                ? svc.price
                : svc.price * TOTAL_MULTIPLIER
            )
            .reduce((acc, p)=> acc + p, 0);
    }

    static getPriceByType (
        service: Service,
        params: ServicesOrderParams
    ) {
        const multiplier = this.getMultiplier(params);

        return service.fixed_price 
            ? service.price 
            : service.price * multiplier;
    }

    static getMultipliersString (
        t: TranslateFn,
        params: ServicesOrderParams
    ) {
        return `${params.days_count ?? 0}${t("daysShort")} x ${params.visitors_count ?? 0}${t("visitorsShort")} `;
    }
}