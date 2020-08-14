class MonthlyFeeCalculator {
    constructor(totalMoney, totalMonths) {
        this.TotalMoney = 0;
        this.TotalMonths = 0;
        this.TotalMoney = totalMoney;
        this.TotalMonths = totalMonths;
    }
    GetMonthlyFee() {
        let value = this.TotalMonths * this.TotalMoney;
        return value + (value * 0.1);
    }
}
let obj = new MonthlyFeeCalculator(5000, 24);
let str = 'Monto solicitado 5000 en 24 meses, valor cuota: ' + obj.GetMonthlyFee();
console.log(str);
alert(str);
//# sourceMappingURL=index.js.map