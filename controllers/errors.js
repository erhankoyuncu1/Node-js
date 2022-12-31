module.exports.get404Page = (req, res) => {
    res.status(404);
    res.render('error/errorPage',
        {
            title: '404',
            path: '/errorPage'
        });
};