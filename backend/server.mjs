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

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  //req.session.view_count+=1;
  res.send("Hello");
  //console.log(req.session.view_count)
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
    });
  } else {
    res.send({ success: false });
  }
});

/*function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/api/signin");
}*/

app.listen(port, () => {
  console.log(`React - Cars App listening at http://localhost:${port}`);
});
