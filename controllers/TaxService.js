'use strict';

const util = require('util');
var debug = true;

exports.calculate_after_tax_incomeGET = function(args, res, next) {
  /**
   * Calculates the annual take home pay for a given salary in Australia.
   * For the purposes of this test use the following tax brackets:   Taxable Income     | Rate ------------------- | ------------- $0 - $18,200        | 0% $18,201 - $37,000   | 19% $37,001 - $87,000   | 32.5% $87,001 - $180,000  | 37% Over $180,000       | 45%  The Australian tax rules specify that only whole dollars be taxed, e.g. `$87,000.50` is taxed as `$87,000.00`.  In addition to basic income tax please also apply the medicare levy using the rules.  Taxable Income     | Rate ------------------- | ------------- Up to $21,336       | 0% $21,336 to $26,668  | 10% of amount over $21,336 Over $26,668        | 2%  The medicare levey surcharge can be ignored as the rules for whether or not it applies are beyond the scope of this excersise.  Superannuation should be calculated as `9.5%` on top of the base salary and rounded to the nearest cent.  #### Rounding  - The ATO have a crazy rule where values above `0.159` are rounded up. - Medicare levy is rounded to the nearest cent. - Total taxes are the sum of income tax and medicare rounded to the nearest whole dollar. 
   *
   * annualBaseSalary Double The base salary in AUD
   * returns CalculatedPay
   **/
   
	if(!isNaN(args.annualBaseSalary.originalValue)){
		var CalculatedPay = ({
		  baseSalary: Number(args.annualBaseSalary.originalValue),
		  superannuation: 0,
		  taxes : {income: 0,
		  medicare: 0,
		  total: 0,
		  },
		  afterTaxIncome: 0,
		});
		var roundedBase = Math.floor(args.annualBaseSalary.originalValue);
		if (debug) console.log("salary " + roundedBase);
		
		CalculatedPay.taxes.income = Number(getIncomeTax(roundedBase));
		CalculatedPay.taxes.medicare = Number(getMedicareLevy(roundedBase));
		CalculatedPay.superannuation = Number(getSuper(roundedBase));
		CalculatedPay.taxes.total = Math.round(Number(CalculatedPay.taxes.income) + Number(CalculatedPay.taxes.medicare));
		if (debug) console.log("total " + CalculatedPay.taxes.total);
		CalculatedPay.afterTaxIncome = Math.round(Number(CalculatedPay.baseSalary) - Number(CalculatedPay.taxes.total));
		if (debug) console.log("postTax " + CalculatedPay.afterTaxIncome);
		
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(CalculatedPay, null, 2));
	}else {
    res.end();
  }
}

exports.calculate_pre_tax_income_from_take_homeGET = function(args, res, next) {
  /**
   * Calculates pre tax annual salary required for a desired take home pay.
   *  > **This API is optional, you may do it if your still under three hours or if you just enjoy the challenge.**  The tax calculation rules are the same as the `/api/calculate-after-tax-income` API, please refer to that description for details. 
   *
   * postTaxSalary Double The desired after tax income in AUD
   * returns CalculatedPay
   **/  
    res.end();
}

function getIncomeTax(salary){
	var iTax = 0;
	if((salary >= 18200)&&(salary <= 37000)){
		iTax = (salary-18200)*0.19;
	}else 
		if ((salary >= 37001)&&(salary <= 87000)){
		iTax = (salary-37000)*0.325 + 3572;
	}else 
		if ((salary >= 87001)&&(salary <= 180000)){
		iTax = (salary-87000)*0.37 + 16250 + 3572;
	}else{
		iTax = (salary-180000)*0.45 + 34410 + 16250 + 3572;
	}
	var remainder = (iTax % 1).toFixed(3);
	if (remainder >= 0.159){
		iTax = Math.ceil(iTax);
	}else{
		iTax = Math.floor(iTax);
	}
	if (debug) console.log("income tax " + iTax);
	return iTax;
}

function getMedicareLevy(salary){
	var levy = 0;
	
	if ((salary >= 21336)&&(salary <= 26668)){
		levy = (salary - 21336)*0.1;
	}else 
		if (salary > 26668){
		levy = (salary - 26668)*0.02 + 533.2;
	}
	if (debug) console.log("medicare " + levy.toFixed(2));
	return levy.toFixed(2);
}

function getSuper(salary){
	var superannuation = 0;
	superannuation = (salary * 0.095);
	if (debug) console.log("super " + superannuation.toFixed(2));
	return superannuation.toFixed(2);
}