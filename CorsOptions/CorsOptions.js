

exports.CorsOptions = {
    origin: [`http://localhost:3000`, `http://localhost:3000/home`],
    methods: ['GET', 'POST', 'PUT', 'DELETE', `PATCH`],
    credentials: true
}
