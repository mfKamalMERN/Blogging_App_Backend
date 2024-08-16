

exports.CorsOptions = {

    origin: [`http://localhost:3001`, `http://localhost:3001/home`, `http://localhost:3001/followings/:userid`, `http://localhost:3001/followers/:userid`, `http://localhost:3001/profile/:userid`, `http://localhost:3001/newblog`],

    methods: ['GET', 'POST', 'PUT', 'DELETE', `PATCH`],

    credentials: true
}
