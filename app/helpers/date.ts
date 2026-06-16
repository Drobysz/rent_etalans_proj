export class TimeService {
    static convertToUTCDateFormat (dateString: string) {
        const date = new Date(dateString);

        const day = String(date.getUTCDate()).padStart(2, "0");
        const month = String(date.getUTCMonth()).padStart(2, "0");
        const year = String(date.getUTCFullYear());

        return `${day}/${month}/${year}`;
    }
}