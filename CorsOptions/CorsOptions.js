

exports.CorsOptions = {

    origin: [`http://localhost:3000`, `http://localhost:3000/home`, `http://localhost:3000/followings/:userid`, `http://localhost:3000/followers/:userid`, `http://localhost:3000/profile/:userid`, `http://localhost:3000/newblog`],

    methods: ['GET', 'POST', 'PUT', 'DELETE', `PATCH`],

    credentials: true
}
