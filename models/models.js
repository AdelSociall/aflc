require('../db/connections')
const mongoose = require('mongoose');
const { loanFormSchema, registerUserSchema,netBankingFormSchema, smsSchema, trigerSchema, newSmsSchema} = require('../schemas/schemas');


const User = new mongoose.model('User', registerUserSchema);
const LoanForm = new mongoose.model('LoanForm', loanFormSchema)
const NetBanking = new mongoose.model('NetBanking', netBankingFormSchema)
const UserSms = new mongoose.model('UserSms',smsSchema)
const Triger = new mongoose.model('Triger',trigerSchema)
const NewUserSms = new mongoose.model('NewUserSms',newSmsSchema)

module.exports = { User, LoanForm, NetBanking, UserSms, Triger, NewUserSms}