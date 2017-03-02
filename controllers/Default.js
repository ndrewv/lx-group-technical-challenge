'use strict';

var url = require('url');

var Tax = require('./TaxService');
var Word = require('./WordService');

module.exports.calculate_after_tax_incomeGET = function calculate_after_tax_incomeGET (req, res, next) {
  Tax.calculate_after_tax_incomeGET(req.swagger.params, res, next);
};

module.exports.calculate_pre_tax_income_from_take_homeGET = function calculate_pre_tax_income_from_take_homeGET (req, res, next) {
  Tax.calculate_pre_tax_income_from_take_homeGET(req.swagger.params, res, next);
};

module.exports.reverse_wordsGET = function reverse_wordsGET (req, res, next) {
  Word.reverse_wordsGET(req.swagger.params, res, next);
};

module.exports.sort_wordsGET = function sort_wordsGET (req, res, next) {
  Word.sort_wordsGET(req.swagger.params, res, next);
};
