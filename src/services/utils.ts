
class Utils {

    static formatDate(date: Date) {
        return `${this.addTrailingZero(date.getDate())}/${this.addTrailingZero(date.getMonth() + 1)}/${date.getFullYear()} ${this.addTrailingZero(date.getHours())}h${this.addTrailingZero(date.getMinutes())}`;
    }

    private static addTrailingZero(n: number): string {
        return n < 10 ? `0${n}` : n.toString();
    }

}

export { Utils };