module.exports = function (req, res, next) {
    var user = auth(req);
    if (!req.session || !req.session.name || !req.session.pass) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        res.sendStatus(401);
        return;
    }
    if (req.session.name === 'test' && req.session.pass === 'test') {
        req.username = user.name;
        next();
    } else {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        res.sendStatus(401);
    }
};