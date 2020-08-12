class MonthlyFeeCalculator {
  TotalMoney = 0;
  TotalMonths = 0;
  constructor(totalMoney: number, totalMonths: number) {
    this.TotalMoney = totalMoney;
    this.TotalMonths = totalMonths;
  }
  GetMonthlyFee() {
    return this.TotalMonths * this.TotalMoney;
  }
}
