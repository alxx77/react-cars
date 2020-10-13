import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import initialize from "./passport-config.mjs";
import * as ItemController from "./ItemController.mjs";
import * as BrandController from "./BrandController.mjs";
import * as ModelController from "./ModelController.mjs";
import * as ImageController from "./ImageController.mjs";
import * as UserController from "./UserController.mjs";
import formidable from "formidable";

const app = express();
const port = 3003;

initialize(passport, UserController.getUserByEmail, UserController.getUserById);

app.use(
  cors({
    origin: `http://localhost:3000`,
    credentials: true,
    
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

/*function cLog(req,res,next){
  console.log("sessid: " + req.session.id)
  console.log("user: " + (req.user===undefined ? "" : req.user.username))
  return next();
}*/

//app.use(cLog);

app.get("/", (req, res) => {
  res.send({success:true})
});

//podaci o ponudi
app.get("/api/get_item_by_id/:id_pon", (req, res) => {

  ItemController.getItemById(req, res);
});

//lista svih aktivnih ponuda
app.get("/api/get_all_items", (req, res) => {


  ItemController.getItems(req, res);
});

//naslovna slika ponude
app.get("/api/get_item_default_image/:id_pon", (req, res) => {

  ItemController.getItemDefaultImage(req, res);
});

//lista proizv.
app.get("/api/get_brand_list", (req, res) => {
  BrandController.getBrandList(req, res);
});

//lista modela za datog proizv.
app.get("/api/get_model_list_by_brand/:id_brand", (req, res) => {
  ModelController.getModelListByBrand(req, res);
});

//slika
app.get("/api/get_image_by_id/:image_id", (req, res) => {
  
  ImageController.getImage(req, res);
});

//sve slike jedne ponude
app.get("/api/get_items_images/:id_pon", (req, res) => {
  ImageController.getAllImagesForItem(req, res);
});

app.post("/api/write_item/:id_pon", (req, res, next) => {

  if (!req.user) {
    res.send({
      success: false,
      error: "Not Authenticated",
    });
    return;
  }

  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    ItemController.writeItem(req, res, { fields, files });
  });
});

//signin
app.post("/api/signin", passport.authenticate("local"), (req, res) => {
  if (req.user) {
    res.send({
      success: true,
      username: req.user.username,
      user_type: req.user.user_type,
      user_id: req.user.user_id,
    });
  } else {
    res.send({ success: false });
  }
});



app.listen(port, () => {
  console.log(`React - Cars App listening at http://localhost:${port}`);
});
