const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://adel123:adel123@cluster0.mkdgo6a.mongodb.net/aastha_finance?retryWrites=true&w=majority')
.then(()=>{
    console.log('Congrates, DataBase Connected Successfully')
})
.catch(()=>{
    console.log('Sorry, Unable to Connect with DataBase')
})