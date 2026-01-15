const mongoose = require("mongoose");
const mongo_url = process.env.MONGO_CONN;
mongoose.connect(mongo_url
//     , {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }
)
.then(() => console.log("Mongo Database  connected"))
.catch(err => console.log('MongoDb Connection Error : ',err));

module.exports = mongoose;
