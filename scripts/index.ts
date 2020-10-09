//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
interface IConfiguration {
  id: number;
  isClientPercentaje: number;
  isNotClientePercentaje: number;
  moneyMinValue: number;
  moneyMaxValue: number;
  monthMinValue: number;
  monthMaxValue: number;
  reliefInsurance: number;
}
//objeto con valores de configuracion de los controles
let objConfiguration: IConfiguration; /*= {
  isClientPercentaje: 7.95,
  isNotClientePercentaje: 9.11,
  moneyMinValue: 100,
  moneyMaxValue: 20000,
  monthMinValue: 1,
  monthMaxValue: 48,
  reliefInsurance: 10,
};*/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//clase que realiza el calculo del monto de la cuota mensual
class MonthlyFeeCalculator {
  TotalMoney = 0;
  TotalMonths = 0;
  UseRelief: boolean;
  IsClient: boolean;

  MonthlyFee: number;
  TotalLoan: number;

  constructor(
    totalMoney: number,
    totalMonths: number,
    useRelief: boolean,
    isClient: boolean
  ) {
    this.TotalMoney = totalMoney;
    this.TotalMonths = totalMonths;
    this.UseRelief = useRelief;
    this.IsClient = isClient;

    let percentaje = this.IsClient
      ? objConfiguration.isClientPercentaje
      : objConfiguration.isNotClientePercentaje;
    let money = this.TotalMoney / this.TotalMonths;
    percentaje = (percentaje * 100) / money;

    this.MonthlyFee = Number(
      (
        money +
        percentaje +
        (this.UseRelief ? objConfiguration.reliefInsurance : 0)
      ).toFixed(2)
    );
    this.TotalLoan = Number((this.MonthlyFee * this.TotalMonths).toFixed(2));
  }
  GetMonthlyFee() {
    return this.MonthlyFee;
  }
  GetTotalLoan() {
    return this.TotalLoan;
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//declaracion de variables relacionadas a objeto html
const pbMoney = document.getElementById("pbMoney") as HTMLInputElement;
const pbMonth = document.getElementById("pbMonth") as HTMLInputElement;
const tbMoney = document.getElementById("tbMoney") as HTMLInputElement;
const tbMonth = document.getElementById("tbMonth") as HTMLInputElement;
const tableRows = document.getElementById("tableRows") as HTMLTableRowElement;
const divReliefInsurance = document.getElementById(
  "divReliefInsurance"
) as HTMLDivElement;
const chkReliefInsurance = document.getElementById(
  "chkReliefInsurance"
) as HTMLInputElement;
const chkClient = document.getElementById("chkClient") as HTMLInputElement;

const lbInterest = document.getElementById("lbInterest") as HTMLSpanElement;
const tbReliefInsurance = document.getElementById(
  "tbReliefInsurance"
) as HTMLParagraphElement;
const tbTotalLoan = document.getElementById(
  "tbTotalLoan"
) as HTMLParagraphElement;
const lbMonthlyFee = document.getElementById("lbMonthlyFee") as HTMLHRElement;
const lbTotalLoan = document.getElementById(
  "lbTotalLoan"
) as HTMLParagraphElement;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//programacion de eventos
pbMoney.onmousemove = () => {
  tbMoney.value = "$ " + pbMoney.value;
  calculate();
};

pbMonth.onmousemove = () => {
  tbMonth.value = pbMonth.value;
  calculate();
};

chkReliefInsurance.onchange = () => {
  divReliefInsurance.classList.toggle("d-none");
  calculate();
};

chkClient.onchange = () => {
  lbInterest.innerHTML =
    (chkClient.checked
      ? objConfiguration.isClientPercentaje
      : objConfiguration.isNotClientePercentaje) + "%";
  calculate();
};

const calculate = () => {
  let obj = new MonthlyFeeCalculator(
    Number(pbMoney.value),
    Number(pbMonth.value),
    chkReliefInsurance.checked,
    chkClient.checked
  );

  lbMonthlyFee.innerHTML = String(obj.GetMonthlyFee());
  lbTotalLoan.innerHTML = String(obj.GetTotalLoan());

  let month = new Date();

  tableRows.innerHTML = "";

  let html = "";
  for (let coute = 1; coute <= obj.TotalMonths; coute++) {
    month.setMonth(month.getMonth() + 1);
    month = new Date(month.getFullYear(), month.getMonth(), 20);
    console.log("firstMonth", coute, month);
    html += `
    <tr>
    <th scope="row text-left">${coute}</th>
    <td class="text-center" >${formatDate(month)}</td>     
    <td class="text-right">${obj.GetMonthlyFee()}</td>
    </tr>`;
  }
  html += `
  <tr  >
  <th scope="row  "></th>
  <td class="text-right" >Total</td>     
  <td class="text-right" >${obj.GetTotalLoan()}</td>
  </tr>`;
  tableRows.innerHTML = html;
};

function formatDate(date: Date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//seteando los valores de configuracion a los objetos html
/*window.onload = () => {
  pbMoney.setAttribute("min", String(objConfiguration.moneyMinValue));
  pbMoney.setAttribute("max", String(objConfiguration.moneyMaxValue));
  pbMoney.setAttribute("value", String(objConfiguration.moneyMinValue));

  pbMonth.setAttribute("min", String(objConfiguration.monthMinValue));
  pbMonth.setAttribute("max", String(objConfiguration.monthMaxValue));
  pbMonth.setAttribute("value", String(objConfiguration.monthMinValue));

  tbMoney.value = "$" + objConfiguration.moneyMinValue;
  tbMonth.value = String(objConfiguration.monthMinValue);

  calculate();
};

*/
$(document).ready(function () {
  //animacion con jquery,  div "tu cuota mensual"
  $("#pbMoney,#pbMonth").mousedown(function () {
    $("#divResume").fadeTo("slow", 0.2);
  });

  $("#pbMoney,#pbMonth").mouseup(function () {
    $("#divResume").fadeTo("slow", 1);
  });

  /*
  llamado ajax para traer la configuracion de los controles progress 
  y valores para el calculo de la cuota  
  utilice el paquete ( https://www.npmjs.com/package/json-server ) para simular al servidor
  */

  $.ajax({
    type: "GET",
    dataType: "json",
    url: "http://localhost:3000/configuration",
  }).done((data) => {
    console.log("data", data);
    objConfiguration = data[0] as IConfiguration;

    pbMoney.setAttribute("min", String(objConfiguration.moneyMinValue));
    pbMoney.setAttribute("max", String(objConfiguration.moneyMaxValue));
    pbMoney.setAttribute("value", String(objConfiguration.moneyMinValue));

    pbMonth.setAttribute("min", String(objConfiguration.monthMinValue));
    pbMonth.setAttribute("max", String(objConfiguration.monthMaxValue));
    pbMonth.setAttribute("value", String(objConfiguration.monthMinValue));

    tbMoney.value = "$" + objConfiguration.moneyMinValue;
    tbMonth.value = String(objConfiguration.monthMinValue);

    calculate();
  });
});
