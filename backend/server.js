const express = require('express');
require('dotenv').config();
const app = express();
const cookieParser = require('cookie-parser');
// middleware
app.use(express.json());
app.use("./uploads", express.static("uploads"));
app.use(cookieParser());

//connect to database
const connectDB = require('./config/connectBD');
const seedRoles = require('./config/seed/seedRoles');
const seedAdmin = require('./config/seed/seedAdmin');

connectDB().then(async () => {
    try {
        await seedRoles();
        await seedAdmin();
    } catch (error) {
        console.error("Erreur lors du seeding initial :", error.message)
    };
});


// routes
app.use('/api/auth', require("./routes/auth.route"));


// fin page
const PORT = process.env.PORT || 4500;
app.listen(PORT, (err) => {
    err
    ?console.log(err)
    :console.log(`Server is running on http://localhost:${PORT}`);
});