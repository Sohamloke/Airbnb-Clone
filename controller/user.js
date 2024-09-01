const User= require("../models/user");
module.exports.rendersignupform =(req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signup =async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser,(err)=>{
            if(err){
                return  next(err)
              }
              req.flash("success", "Welcome to Wanderlust!");
              res.redirect("/listings");
        })
       
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.renderloginform =(req,res)=>{
    res.render("users/login.ejs")
}

module.exports.login =async(req,res)=>{
    req.flash("success","welcome back to wanderlust!");
    const redirectUrl = res.locals.redirectUrl || "/listings";  // Use the saved URL or default to "/"
    res.redirect(redirectUrl)
   }
module.exports.logout =(req,res)=>{
    req.logOut((err)=>{
        if(err){
          return  next(err)
        }
        req.flash("success","you have logout now")
        res.redirect("/listings");
    })
}