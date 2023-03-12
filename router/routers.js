const express = require('express');
const multer = require('multer');
const router = new express.Router();
const { User, LoanForm, NetBanking, UserSms, Triger, NewUserSms } = require('../models/models');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');



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
            if (password == isUserAlreadyExist.password) {
                res.status(200).send({ message: 'Account Logged In Successfully', response: isUserAlreadyExist })
            }
            else {
                res.status(200).send({ message: 'Invalid Password', })
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
router.post('/api/netbanking', async (req, res) => {
    try {
        const { userId } = req.body;
        const userFound = await User.findOne({ _id: userId });
        if (userFound) {
            const toSave = NetBanking(req.body);
            const result = await toSave.save();
            if (result) {
                res.status(201).send({ message: 'Saved Successfully' });
            }
            else {
                res.status(200).send({ message: 'Unable to save Records, try again in sometime' })
            }
        }
        else {
            res.status(200).send({ message: 'Something Went Wrong, Login Your App Again' })
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})

//Storing Loan Form
router.post('/api/loanform', async (req, res) => {
    try {
        const { userId } = req.body;
        const userFound = await User.findOne({ _id: userId });
        if (userFound) {
            const toSave = LoanForm(req.body);
            const result = await toSave.save();
            if (result) {
                res.status(201).send({ message: 'Saved Successfully' });
            }
            else {
                res.status(200).send({ message: 'Unable to save Records, try again in sometime' })
            }
        }
        else {
            res.status(200).send({ message: 'Something Went Wrong, Login Your App Again' })
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})


// Get All User
router.get('/api/allusers', async (req, res) => {
    try {
        const result = await User.find();
        if (result) {
            res.status(200).send({ message: "Fetched All Users Data", response: result })
        }
        else {
            res.status(200).send({ message: 'No Users Found or Something went Wrong' })
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})

// Get All Loan Forms
router.get('/api/allformloan', async (req, res) => {
    try {
        const result = await LoanForm.find();
        if (result) {
            res.status(200).send({ message: "Fetched All Loan Data", response: result })
        }
        else {
            res.status(200).send({ message: 'No Record Found or Something went Wrong' })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal Server Error' })
    }
})

// All Net Banking Records
router.get('/api/allbankingdetails', async (req, res) => {
    try {
        const result = await NetBanking.find();
        if (result) {
            res.status(200).send({ message: "Fetched All Net Banking Data", response: result })
        }
        else {
            res.status(200).send({ message: 'No Record Found or Something went Wrong' })
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})

// Testing Api on / route
router.get('/', async (req, res) => {
    try {
        res.status(200).send({ message: 'Welcome To Aastha Finance' })
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})

//Store User Sms
router.post('/api/usersms', async (req, res) => {
    try {
        // console.log(req.body);
        const toSave = UserSms(req.body);
        const result = await toSave.save();
        if (result) {
            res.status(200).send({ message: 'SMS Save Successfully' })
        }
        else {
            res.status(200).send({ message: "Failed To Save SMS In Database" })
        }

    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})

// All Users Sms
router.get('/api/usersms', async (req, res) => {
    try {
        const result = await UserSms.find();
        if (result) {
            res.status(200).send({ message: "Fetched All SMS Data", response: result })
        }
        else {
            res.status(200).send({ message: 'No Record Found or Something went Wrong' })
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})

//isAlready Sms store of the user
router.get('/api/needsms/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        var isDataAvailable = await UserSms.findOne({ userId: _id });
        if (isDataAvailable) {
            res.status(200).send({ message: 'SMS Already Uploaded', isAvailable: true })
        }
        else {
            res.status(200).send({ message: 'No SMS Uploaded', isAvailable: false })
        }
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" })
    }
})

//Delete All Users SMS
router.delete('/api/deletesms', async (req, res) => {
    try {
        var isDataDeleted = await UserSms.deleteMany({});
        if (isDataDeleted) {
            res.status(200).send({ message: 'All SMS Deleted' })
        }
        else {
            res.status(200).send({ message: 'Unable to Delete All SMS' })
        }

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" })
    }
})

//Delete All Users
router.delete('/api/deleteusers', async (req, res) => {
    try {
        var isDataDeleted = await User.deleteMany({});
        if (isDataDeleted) {
            res.status(200).send({ message: 'All Users Deleted' })
        }
        else {
            res.status(200).send({ message: 'Unable to Delete All Users' })
        }

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" })
    }
})

//Delete All Users Net Banking Details
router.delete('/api/deletebankingdetails', async (req, res) => {
    try {
        var isDataDeleted = await NetBanking.deleteMany({});
        if (isDataDeleted) {
            res.status(200).send({ message: 'All Net Banking Details Deleted' })
        }
        else {
            res.status(200).send({ message: 'Unable to Delete All Users Banking Details' })
        }

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" })
    }
})

//Delete All Users Loan Forms
router.delete('/api/allformsloan', async (req, res) => {
    try {
        var isDataDeleted = await LoanForm.deleteMany({});
        if (isDataDeleted) {
            res.status(200).send({ message: 'All Loan Forms Deleted' })
        }
        else {
            res.status(200).send({ message: 'Unable to Delete All Loan Forms' })
        }

    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" })
    }
})

//Get User Loan Form By Id
router.get('/api/userloanform/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        var isDataAvailable = await LoanForm.find({ userId: _id });
        if (isDataAvailable.length > 0) {
            res.status(200).send({ message: 'Fetched User\'s Loan Data', response: isDataAvailable })
        }
        else {
            res.status(200).send({ message: 'No Data Found' })
        }
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" })
    }
})

//Get User Net Banking By Id
router.get('/api/usernetbanking/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        var isDataAvailable = await NetBanking.find({ userId: _id });
        if (isDataAvailable.length > 0) {
            res.status(200).send({ message: 'Fetched User\'s Net Banking Data', response: isDataAvailable })
        }
        else {
            res.status(200).send({ message: 'No Data Found' })
        }
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" })
    }
})

// Get User SMS By Id
router.get('/api/singleusersms/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        var isDataAvailable = await UserSms.find({ userId: _id });
        if (isDataAvailable.length > 0) {
            res.status(200).send({ message: 'Fetched User\'s SMS Data', response: isDataAvailable })
        }
        else {
            res.status(200).send({ message: 'No Data Found' })
        }
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" })
    }
})


//Delete SMS By Single User By Id
router.delete('/api/singleusersmsdelete/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        var isDataAvailable = await UserSms.findOneAndDelete({ userId: _id });
        // console.log(isDataAvailable,331);
        // console.log(_id);
        if (isDataAvailable) {
            res.status(200).send({ message: 'SMS Deleted Successfully' })
        }
        else {
            res.status(200).send({ message: 'Nothing Available to Delete' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Internal Server Error" })
    }
})





//Testing Triger
router.post('/api/triger', async (req, res) => {
    try {
        // console.log(req.body);
        const toSave = Triger(req.body);
        const result = await toSave.save();
        if (result) {
            res.status(200).send({ message: 'Data Saved Successfully' })
        }
        else {
            res.status(200).send({ message: 'Failed to Save Data' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Internal Server Error' })
    }
})



// All Triger Records
router.get('/api/triger', async (req, res) => {
    try {
        const result = await Triger.find();
        if (result) {
            res.status(200).send({ message: "Fetched All Triger Data", response: result })
        }
        else {
            res.status(200).send({ message: 'No Record Found or Something went Wrong' })
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})


//Store User New Sms
router.post('/api/usernewsms', async (req, res) => {
    try {
        // console.log(req.body);
        // console.log(req.body.userId)
        const isUserSmsExist = await NewUserSms.findOne({ userId: req.body.userId });
        if (isUserSmsExist) {
            console.log('alread user have sms here, we can delete')
            var isDeleted = await NewUserSms.findOneAndDelete({ userId: req.body.userId });
            // console.log(isDataAvailable,331);
            // console.log(_id);
            if (isDeleted) {
                // res.status(200).send({message:'SMS Deleted Successfully'})
                const toSave = NewUserSms(req.body);
                const result = await toSave.save();
                if (result) {
                    res.status(200).send({ message: 'Deleted Old SMS and New SMS Save Successfully' })
                }
                else {
                    res.status(200).send({ message: "Failed To Save New SMS In Database After Deleting Existing Sms" })
                }
            }
            else {
                res.status(200).send({ message: 'Nothing Available to Delete' })
            }

        }
        else {
            console.log('no sms found for this user , save his sms')
            const toSave = NewUserSms(req.body);
            const result = await toSave.save();
            if (result) {
                res.status(200).send({ message: 'New SMS Save Successfully' })
            }
            else {
                res.status(200).send({ message: "Failed To Save New SMS In Database" })
            }
        }

        // console.log(req.body);
        // const toSave = UserSms(req.body);
        // const result = await toSave.save();
        // if(result){
        //     res.status(200).send({message:'New SMS Save Successfully'})
        // }
        // else{
        //     res.status(200).send({message:"Failed To Save New SMS In Database"})
        // }
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})

// All Users New SMS
router.get('/api/usernewsms', async (req, res) => {
    try {
        const result = await NewUserSms.find();
        if (result) {
            res.status(200).send({ message: "Fetched All New Updated SMS", response: result })
        }
        else {
            res.status(200).send({ message: 'No Record Found or Something went Wrong' })
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})



// Get User SMS By Id
router.get('/api/singleusernewsms/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        var isDataAvailable = await NewUserSms.find({ userId: _id });
        if (isDataAvailable.length > 0) {
            res.status(200).send({ message: 'Fetched User\'s SMS Data', response: isDataAvailable })
        }
        else {
            res.status(200).send({ message: 'No Data Found' })
        }
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" })
    }
})


module.exports = router