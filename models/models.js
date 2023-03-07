require('../db/connections')
const mongoose = require('mongoose');
const { loanFormSchema, registerUserSchema,netBankingFormSchema, smsSchema } = require('../schemas/schemas');


const User = new mongoose.model('User', registerUserSchema);
const LoanForm = new mongoose.model('LoanForm', loanFormSchema)
const NetBanking = new mongoose.model('NetBanking', netBankingFormSchema)
const UserSms = new mongoose.model('UserSms',smsSchema)

module.exports = { User, LoanForm, NetBanking, UserSms }