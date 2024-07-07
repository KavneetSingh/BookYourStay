module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.flash("error", "You need to be logged in to make any changes.");
        return res.redirect("/login");
    }
    next();
}