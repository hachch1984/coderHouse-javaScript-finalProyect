class MonthlyFeeCalculator {
    constructor(totalMoney, totalMonths) {
        this.TotalMoney = 0;
        this.TotalMonths = 0;
        this.TotalMoney = totalMoney;
        this.TotalMonths = totalMonths;
    }
    GetMonthlyFee() {
        return this.TotalMonths * this.TotalMoney;
    }
}
//# sourceMappingURL=index.js.map