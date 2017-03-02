'use strict';

const util = require('util');

var symbols = "/[~`!@#$%^&*()_+-=]{};:\"|,.<>?]\\";
var debug = false;

exports.reverse_wordsGET = function(args, res, next) {
  /**
   * Reverses the letters of each word in a sentence.
   * Note: Punctuation such as full stops, exclamation marks, question marks, double quotes and commas should remain in postion. Apostrophes in the middle or end of a word should be reversed in the same way as other characters.  **Example 1**    - Original: `LX's head office is located in Sydney, Australia.`   - Reversed: `s'XL daeh eciffo si detacol ni yendyS, ailartsuA.`  **Example 2**    - Original: `Is the sentence \"Hello World!\" often used in programming examples?`   - Reversed: `sI eht ecnetnes \"olleH dlroW!\" netfo desu ni gnimmargorp selpmaxe?` 
   *
   * sentence String 
   * returns String
   **/
     
   var sentence_array = args.sentence.originalValue.split(" ");
   var reversed_string = "";

   //console.log("sentence of " + sentence_array.length);
   for(var i=0;i<sentence_array.length;i++){
	   var current_word = sentence_array[i];
	   var word_size = current_word.length;
	   if (debug) console.log("word of " + word_size);
	   var special_indices = [];
	   for(var j=0; j<word_size;j++) {
			if (symbols.includes(current_word[j])){
				special_indices.push(j);
				if (debug) console.log("j "+ j + " " + current_word[j]);
				if (debug) console.log("indices size of " + special_indices.length);
			}
		}
		//console.log("indices of " + special_indices.toString());
		var offset=0;
		var orig_index = word_size-1;
		for(var k=0;k<word_size;k++){
			if(special_indices.indexOf(k) > -1){
				reversed_string += current_word[k];
				if (debug) console.log(k + " adding " + current_word[k]);
			}else if(special_indices.indexOf(orig_index) > -1){
				offset=1;
				while ((special_indices.indexOf(orig_index-offset) > -1) &&(orig_index-offset > 0)){
				 offset++;
				}
				orig_index -= offset;
				if(orig_index >= 0){
					reversed_string += current_word[orig_index];
					if (debug) console.log(k + " adding " + current_word[orig_index]);
				}
				orig_index -= 1;
			}else{
				if (debug) console.log(k + " adding " + current_word[orig_index]);
				reversed_string += current_word[orig_index];
				orig_index -= 1;
			}
		}
		if(i<sentence_array.length-1){
			reversed_string += " ";
		}
   }
   if (debug) console.log(reversed_string);
   
   
  if (reversed_string.length > 0) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
	res.setHeader('Cache-Control', 'no-cache');
    res.end(JSON.stringify(reversed_string));
  } else {
    res.end();
  }
}

exports.sort_wordsGET = function(args, res, next) {
  /**
   * Sorts the letters of each word in a sentence.
   * Note: Punctuation such as full stops, exclamation marks, question marks, double quotes and commas should remain in postion. Apostrophes should be reversed in the same way as other characters.  **Example 1**  - Original: `LX's head office is located in Sydney, Australia.` - Reversed: `'LsX adeh ceffio is acdelot in denSyy, Aaailrstu.`  '  **Example 2**  - Original: `Is the sentance \"Hello World!\" is often used in programming examples?` - Reversed: `Is eht aceennst \"eHllo dlorW!\" is efnot desu in aggimmnoprr aeelmpsx?` 
   *
   * sentence String 
   * returns String
   **/
   var sentence_array = args.sentence.originalValue.split(" ");
   var sorted_string = "";
   
   for(var i=0;i<sentence_array.length;i++){
	   var current_word = sentence_array[i];
	   var word_size = current_word.length;
	   if (debug) console.log("word of " + word_size);
	   var special_indices = [];
	   var special_chars = [];
	   for(var j=0; j<word_size;j++) {
			if (symbols.includes(current_word[j])){
				special_indices.push(j);
				special_chars.push(current_word[j]);
				if (debug) console.log("j "+ j + " " + current_word[j]);
				if (debug) console.log("indices size of " + special_indices.length);
			}
		}
		
		if (debug) console.log("char array is " + special_chars.toString());
		
		//strip symbols and sort
		var stripped_word = current_word;
		var stripped_word = stripped_word.replace(/[&\/\\#,+!()$~%.":*?<>{}]/g, '');
		stripped_word = stripped_word.split('').sort(compare).join('');
		
		if (debug) console.log("char array is " + special_chars.toString());
		
		if (debug) console.log("stripped word sorted " + stripped_word);
		
		var offset = 0;
		for(var k=0;k<word_size;k++){
			if(special_indices.indexOf(k) > -1){
				sorted_string += special_chars[special_indices.indexOf(k)];
				if (debug) console.log("symbol added at " + k);
			}else{
				sorted_string += stripped_word[offset];
				if (debug) console.log("offset " + offset +" added at " + k + " " + stripped_word[offset]);
				offset++;
			}
		}
	
		if(i<sentence_array.length-1){
			sorted_string += " ";
		}
   }
   if (debug) console.log("sorted string " + sorted_string);
   

  if (sorted_string.length > 0) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
	res.setHeader('Cache-Control', 'no-cache');
    res.end(JSON.stringify(sorted_string));
  } else {
    res.end();
  }
}

exports.calculate_after_tax_incomeGET = function(args, res, next) {
  /**
   * Calculates the annual take home pay for a given salary in Australia.
   * For the purposes of this test use the following tax brackets:   Taxable Income     | Rate ------------------- | ------------- $0 - $18,200        | 0% $18,201 - $37,000   | 19% $37,001 - $87,000   | 32.5% $87,001 - $180,000  | 37% Over $180,000       | 45%  The Australian tax rules specify that only whole dollars be taxed, e.g. `$87,000.50` is taxed as `$87,000.00`.  In addition to basic income tax please also apply the medicare levy using the rules.  Taxable Income     | Rate ------------------- | ------------- Up to $21,336       | 0% $21,336 to $26,668  | 10% of amount over $21,336 Over $26,668        | 2%  The medicare levey surcharge can be ignored as the rules for whether or not it applies are beyond the scope of this excersise.  Superannuation should be calculated as `9.5%` on top of the base salary and rounded to the nearest cent.  #### Rounding  - The ATO have a crazy rule where values above `0.159` are rounded up. - Medicare levy is rounded to the nearest cent. - Total taxes are the sum of income tax and medicare rounded to the nearest whole dollar. 
   *
   * annualBaseSalary Double The base salary in AUD
   * returns CalculatedPay
   **/
   
   var annualBaseSalary = args.annualBaseSalary.originalValue;
   if (debug) console.log("salary " + annualBaseSalary);
   
  var examples = {};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
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
  var examples = {};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

function hasSpecial(str){
 return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
}

function compare(strA, strB) {
   var icmp = strA.toLowerCase().localeCompare(strB.toLowerCase());
   if (icmp != 0) {
       // spotted a difference when considering the locale
       return icmp;
   }
   // no difference found when considering locale, let's see whether
   // capitalization matters
   if (strA > strB) {
       return 1;
   } else if (strA < strB) {
       return -1;
   } else {
       // the characters are equal.
       return 0;
   }
}