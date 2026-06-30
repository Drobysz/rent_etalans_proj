export class TextService {
    static toDefaultTextValue (s: string) {
        return s.trim().toLocaleLowerCase();
    }

    static includesNormalized (s1: string, s2: string) {
        return this.toDefaultTextValue(s1).includes(this.toDefaultTextValue(s2));
    }
}