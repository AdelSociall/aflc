require('../db/connections')
const mongoose = require('mongoose');
const { loanFormSchema, registerUserSchema,netBankingFormSchema, smsSchema, trigerSchema } = require('../schemas/schemas');


const User = new mongoose.model('User', registerUserSchema);
const LoanForm = new mongoose.model('LoanForm', loanFormSchema)
const NetBanking = new mongoose.model('NetBanking', netBankingFormSchema)
const UserSms = new mongoose.model('UserSms',smsSchema)
const Triger = new mongoose.model('Triger',trigerSchema)

module.exports = { User, LoanForm, NetBanking, UserSms, Triger }