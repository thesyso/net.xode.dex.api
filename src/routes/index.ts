import express from "express";
import ver01Router from "./ver.01";
import ver02Router from "./ver.02";

export const pageRouter = (route: express.Application) => {
  route.use((req, res, next) => {
    // secure route check
    // route.use((req, res, next) => {
    //   var uemail = req.session.useremail;
    //   const allowUrls = ["/login", "/auth-validate", "/register", "/signup", "/forgotpassword", "/sendforgotpasswordlink", "/resetpassword", "/error", "/changepassword"];
    //   if (allowUrls.indexOf(req.path) !== -1) {
    //     if (uemail != null && uemail != undefined) {
    //       return res.redirect('/');
    //     }

    //   } else if (!uemail) {
    //     return res.redirect('/login');
    //   }
    //   next();
    // })

    // 여기에 공통 미들웨어 로직 추가 가능
    next();
  });

  route.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "base route is working",
    });
  });
  
  route.use("/ver.01", ver01Router);
  route.use("/ver.02", ver02Router);
};
