

exports.CorsOptions = {

    origin: [`http://localhost:3000`, `http://localhost:3000/home`, `http://localhost:3000/followings/:userid`, `http://localhost:3000/followers/:userid`, `http://localhost:3000/profile/:userid`, `http://localhost:3000/newblog`, `https://blogging-app-frontend-seven.vercel.app`, `https://blogging-app-frontend-seven.vercel.app/home`, `https://blogging-app-frontend-seven.vercel.app/followings/:userid`, `https://blogging-app-frontend-seven.vercel.app/profile/:userid`, `https://blogging-app-frontend-seven.vercel.app/newblog`],

    methods: ['GET', 'POST', 'PUT', 'DELETE', `PATCH`],

    credentials: true
}
