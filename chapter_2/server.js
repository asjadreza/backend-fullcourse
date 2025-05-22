// The address of this server connected to the network is:
// URL -> http://localhost:8383
// IP -> 127.0.0.1:8383 

const express = require('express');
const app = express();

const PORT = 8383;

// Middleware
app.use(express.json())

const data = ['asjad']

// Endpoints - HTTP VERBS (or methods) && Routes (or paths)
// VERBS: GET, POST, PUT, PATCH
// Routes: /, /auth, /auth/dashboard

// The methods informs the natire of the request and the route is a further
// subdirectory (basically we direct the request to the body of code to respond
// appropriately, and these locations or routes are called endpoints)



// Type - 1 Website endpoints: (these endpoints are for sending back html and they typically come when a user enters a url in a browser)
app.get('/', (req, res) => {
    // the is endpoint number 1 - /
    console.log("Yay I hit the endpoint.", req.method);
    // res.sendStatus(201);
    // res.send('<h1>Homepage</h1>');
    res.send(`
        <body style="background:pink; color: blue;">
        <h1>DATA:</h1>
        <p>${JSON.stringify(data)}</p>
        </body> 
        <a href="/dashboard">Dashboard</a>
        `)
})

app.get('/dashboard', (req, res) => {
    console.log("Ohhh now I hit the /dashboard endpoints");
    res.send(`
        <body>
        <h1>Dashboard</h1>
        <a href="/">Homepage</a>
        </body>
        
        `);
})


// Type -2 Api endpoints: (non visual)

// CRUD-method: create-post read-get update-put and delete-delete

app.get('/api/data', (req, res) => {
    console.log('This one was for data');
    res.status(599).send(data);
})

app.post('/api/data', (req, res) => {
    // Someone wants to create a user (for example when they click a sign up button)
    // the user clicks the sign up button after entering their credentials, and their
    // browser is wired up to send out a network request to the server to handle that acrtion.
    const newEntry = req.body;
    console.log(newEntry);
    data.push(newEntry.name);
    res.sendStatus(201);

})

app.delete('/api/data', (req, res) => {
    data.pop();
    console.log('We deleted the element off the end of the array');
    res.sendStatus(203);
})



app.listen(PORT, () => console.log(`Server has started on: ${PORT}`));