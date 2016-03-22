module.exports = function (req, res, next) {
    if (!req.session || !req.session.name || !req.session.pass) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        res.sendStatus(401);
        return;
    }
    if (req.session.name === 'test' && req.session.pass === 'test') {
        next();
    } else {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        res.sendStatus(401);
    }
};