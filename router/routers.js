const express = require('express');
const multer = require('multer');
const router = new express.Router();
const { User, LoanForm, NetBanking, UserSms } = require('../models/models');
const bcrypt = require('bcryptjs');



const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, './mediaFiles') },
    filename: function (req, file, cb) { cb(null, Date.now() + '_' + file.originalname) }
});

const upload = multer({ storage: storage });





// Register or Sign Up User
router.post('/api/registeruser', async (req, res) => {
    try {
        const { mobile } = req.body;
        const isUserAlreadyExist = await User.findOne({ mobile: mobile });
        if (isUserAlreadyExist) {
            res.status(200).send({ message: 'You have already an account Registered on this Mobile Number.' })
        }
        else {
            const toSave = User(req.body);
            const result = await toSave.save();
            if (result) {
                res.status(201).send({ message: 'Account Created Successfully', response: result })
            }
            else {
                res.status(200).send({ message: 'Failed to save in database' })
            }
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})

// Log In User
router.post('/api/verifyuser', async (req, res) => {
    try {
        const { mobile, password } = req.body;
        const isUserAlreadyExist = await User.findOne({ mobile: mobile });
        if (isUserAlreadyExist) {
            if(password == isUserAlreadyExist.password){
                res.status(200).send({message:'Account Logged In Successfully',response:isUserAlreadyExist})
            }
            else{
                res.status(200).send({message:'Invalid Password',})
            }
        }
        else {
            res.status(200).send({ message: 'No Account Found by this Mobile Number' })
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})

// Store User Banking Details
router.post('/api/netbanking',async(req,res)=>{
    try {
        const {userId}= req.body;
        const userFound = await User.findOne({_id : userId});
        if(userFound){
            const toSave = NetBanking(req.body);
            const result = await toSave.save();
            if(result){
                res.status(201).send({message:'Saved Successfully'});
            }
            else{
                res.status(200).send({message:'Unable to save Records, try again in sometime'})
            }
        }
        else{
            res.status(200).send({message:'Something Went Wrong, Login Your App Again'})
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})

//Storing Loan Form
router.post('/api/loanform',async(req,res)=>{
    try {
        const {userId}= req.body;
        const userFound = await User.findOne({_id : userId});
        if(userFound){
            const toSave = LoanForm(req.body);
            const result = await toSave.save();
            if(result){
                res.status(201).send({message:'Saved Successfully'});
            }
            else{
                res.status(200).send({message:'Unable to save Records, try again in sometime'})
            }
        }
        else{
            res.status(200).send({message:'Something Went Wrong, Login Your App Again'})
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})


// Get All User
router.get('/api/allusers',async(req,res)=>{
    try {
        const result = await User.find();
        if(result){
            res.status(200).send({message:"Fetched All Users Data",response:result})
        }
        else{
            res.status(200).send({message:'No Users Found or Something went Wrong'})
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})

// Get All Loan Forms
router.get('/api/allformloan',async(req,res)=>{
    try {
        const result = await LoanForm.find();
        if(result){
            res.status(200).send({message:"Fetched All Loan Data",response:result})
        }
        else{
            res.status(200).send({message:'No Record Found or Something went Wrong'})
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal Server Error' })
    }
})

// All Net Banking Records
router.get('/api/allbankingdetails',async(req,res)=>{
    try {
        const result = await NetBanking.find();
        if(result){
            res.status(200).send({message:"Fetched All Net Banking Data",response:result})
        }
        else{
            res.status(200).send({message:'No Record Found or Something went Wrong'})
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})


router.get('/',async(req,res)=>{
    try {
        res.status(200).send({message:'Welcome To Aastha Finance'})
    } catch (error) {
        res.status(500).send({message:'Internal Server Error'})
    }
})

//Store User Sms
router.post('/api/usersms',async(req,res)=>{
    try {
        // console.log(req.body);
        const toSave = UserSms(req.body);
        const result = await toSave.save();
        if(result){
            res.status(200).send({message:'SMS Save Successfully'})
        }
        else{
            res.status(200).send({message:"Failed To Save SMS In Database"})
        }
        
    } catch (error) {
        res.status(500).send({message:'Internal Server Error'})
    }
})

// All Users Sms
router.get('/api/usersms',async(req,res)=>{
    try {
        const result = await UserSms.find();
        if(result){
            res.status(200).send({message:"Fetched All SMS Data",response:result})
        }
        else{
            res.status(200).send({message:'No Record Found or Something went Wrong'})
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})


module.exports = router