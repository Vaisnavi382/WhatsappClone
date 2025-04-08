const checkToken = (req, res, next) => {
    const header = req.headers['authorization'];
    console.debug('Inside checkToken:');
    if (typeof header !== 'undefined') {
        console.debug('Inside checkToken, Header', header);
        const token =
            req.cookies.token || req.headers["authorization"]?.split(" ")[1];
        req.token = token;
        console.debug('Inside checkToken, Token', token);
        console.debug('Inside checkToken, Header', req.headers["authorization"]?.split(" ")[1]);
        next();
    } else {
        console.error('Inside checkToken, invalid header');
        res.sendStatus(403);
    }

    next();
}

export default checkToken;