require('../db/connections')
const mongoose = require('mongoose');
const { loanFormSchema, registerUserSchema,netBankingFormSchema } = require('../schemas/schemas');


const User = new mongoose.model('User', registerUserSchema);
const LoanForm = new mongoose.model('LoanForm', loanFormSchema)
const NetBanking = new mongoose.model('NetBanking', netBankingFormSchema)

module.exports = { User, LoanForm, NetBanking }