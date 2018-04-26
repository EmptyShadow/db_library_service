

exports.handle = function (err, res) {
    if (err && err.code === 'E_UNIQUE') {
        return res.sendStatus(409);
    } else if (err && err.name === 'UsageError') {
        return res.badRequest();
    } else if (err) {
        return res.serverError(err);
    }
}