const mongoose= require("mongoose");
const Listing= require("../models/listing");
const initData= require("./data");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/BookYourStay');
}
main()
    .then(res=>{
        console.log("connection established");
    })
    .catch(err=>{
        console.log(err);
    })

const initDB= async ()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=> ({
        ...obj, 
        owner: "668ada7b808672e53b5c6ff5"
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();

// Listing.insertMany(initData.data).then((res)=>{
//     console.log("Saved");
// }).catch(err=>{
//     console.log(err);
// });

// console.log(data);