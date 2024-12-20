

exports.CorsOptions = {

    origin: [`http://localhost:3000`, `http://localhost:3000/home`, `http://localhost:3000/followings/:userid`, `http://localhost:3000/followers/:userid`, `http://localhost:3000/profile/:userid`, `http://localhost:3000/newblog`, `http://localhost:3000/newfriends`, `http://localhost:3000/home/:userid`, `http://localhost:3000/likes/:blogid`, `http://localhost:3000/newmail`, `https://blogging-app-frontend-seven.vercel.app/newmail`, `https://blogging-app-frontend-seven.vercel.app`, `https://blogging-app-frontend-seven.vercel.app/home`, `https://blogging-app-frontend-seven.vercel.app/followings/:userid`, `https://blogging-app-frontend-seven.vercel.app/profile/:userid`, `https://blogging-app-frontend-seven.vercel.app/newblog`, `https://blogging-app-frontend-seven.vercel.app/newfriends`, `https://blogging-app-frontend-seven.vercel.app/home/:userid`, `https://blogging-app-frontend-seven.vercel.app/likes/:blogid`, `https://blogging-app-frontend-seven.vercel.app/followers/:userid`],

    methods: ['GET', 'POST', 'PUT', 'DELETE', `PATCH`],

    credentials: true
}

// `http://localhost:3000`, `http://localhost:3000/home`, `http://localhost:3000/followings/:userid`, `http://localhost:3000/followers/:userid`, `http://localhost:3000/profile/:userid`, `http://localhost:3000/newblog`
