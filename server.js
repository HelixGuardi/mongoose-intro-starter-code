require("dotenv").config();

const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const app = express();

//conectarnos a la base de datos (DB)
const mongoose = require("mongoose");

mongoose
.connect("mongodb://127.0.0.1:27017/artists-db")
.then(() => {
  console.log("todo bien, conectados a la DB")
})
.catch((error) => {
  console.log("problemas conectando con la DB", error)
})

// all middlewares & configurations here
app.use(logger("dev"));
app.use(express.static("public"));

// to allow CORS access from anywhere
app.use(cors({
  origin: '*'
}));

// below two configurations will help express routes at correctly receiving data. 
app.use(express.json()); // recognize an incoming Request Object as a JSON Object
app.use(express.urlencoded({ extended: false })); // recognize an incoming Request Object as a string or array


const Artist = require("./models/artist.model.js")

// all routes here...
app.get("/", (req, res, next) => {
  res.json({ message: "all good here!" })
})

app.get("/test/:bookId", (req, res) => {

  // como nosotros accedemos desde el servidor al el valor del ID
  // req.params // cuando tengo que encontrar un documento especifico
  console.log("req.params", req.params)

  // req.query //cuando tenemos que hacer filtros avanzados
  console.log("req.query", req.query)
  
  // req.body //cuando tenemos que crear, modificar o manejar información
  console.log("req.body", req.body)

  res.json("probando")
})

app.post("/artist", (req, res) => {
  
  console.log(req.body)

  Artist.create({
    name: req.body.name,
    awardsWon: req.body.awardsWon,
    isTouring: req.body.isTouring,
    genre: req.body.genre
  })
  .then((response) => {
    res.json(response); // solo se puede enviar un objeto
  })
  .catch((error) => {
    console.log(error)
  })

})

app.get("/artist/is-touring", (req, res) => {

  // Artist.find( { $and: [ {isTouring: true}, {awardsWon: { $gte: 50 } } ] } )
  Artist.find( { isTouring: true } )
  .then((response) => {
    res.json(response)
  })
  .catch((error) => {
    console.log(error)
  })
})

app.get("/artist/search", (req, res) => {

  console.log("accediendo a la ruta")
  console.log(req.query)

  // Artist.find( req.query ).select({name: 1, awardsWon: 1}).limit(3)
  Artist.find({ name: req.query.name })
  .then((response) => {
    res.json(response);
  })
  .catch((error) => {
    console.log(error)
  })

})

app.get("/artist/:artistId", (req, res) => {

  console.log(req.params)

  Artist.findById(req.params.artistId)
  .then((response) => {
    res.json(response)
  })
  .catch((error) => {
    console.log(error)
  })

})

app.delete("/artist/:artistId", async (req, res) => {

  // a futuro se puede hacer una clausula de guardia aqui
  // para tener mucho más control de lo que está ocurriendo

  try {

    await Artist.findByIdAndDelete( req.params.artistId )
    res.json("todo bien, documento borrado")

  } catch (error) {
    console.log(error)
  }

})

app.put("/artist/:artistId", async (req, res) => {

  console.log(req.params)
  console.log(req.body);

  try {
    
    await Artist.findByIdAndUpdate(req.params.artistId, {
      name: req.body.name,
      awardsWon: req.body.awardsWon,
      isTouring: req.body.isTouring,
      genre: req.body.genre
    })

    res.json("Todo ok, documento editado")

  } catch (error) {
    console.log(error)
  }

})

app.patch("/artist/:artistId/increment-award", async (req, res) => {

  try {
    
    await Artist.findByIdAndUpdate(req.params.artistId, {
      $inc: { awardsWon: 1 }

    })

    res.json("Incrementado valor de awards en 1")

  } catch (error) {
    console.log(error)
  }

})

// server listen & PORT
const PORT = process.env.PORT || 5005

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
