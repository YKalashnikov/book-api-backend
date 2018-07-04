import express from "express";
import authenticate from "../middlewares/authenticate";
import request from "request-promise";
import { parseString } from "xml2js";
import Book from '../models/Book';
import parseErrors from '../utils/parseErrors';



const router = express.Router();
router.use(authenticate)

router.get("/",(req, res) => {
  Book.find({ userId: req.currentUser._id}).then(books => res.json({ books }));
})

router.post("/", (req, res) => {
  Book.create({ ...req.body.book,
     userId: req.currentUser._id })
   .then(book => res.json({ book }))
   .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.get("/search",(req,res) =>{
request
    .get(`https://www.goodreads.com/search/index.xml?key=cbts6iXfSSIAbPgxRNdRw&q=${req.query.q}`)
    .then(result =>
        parseString(result, (err, goodreadsResult) =>
          res.json({
            books: goodreadsResult.GoodreadsResponse.search[0].results[0].work.map(
              work => ({
                id: work.best_book[0].id[0]._,
                title: work.best_book[0].title[0],
                author: work.best_book[0].author[0].name[0],
                images: [work.best_book[0].image_url[0]]
              })
            )
          })
        )
);
     
})
router.get("/fetchPages",(req,res) =>{

  const id = req.query.id;
  request
      .get(`https://www.goodreads.com/book/show.xml?key=cbts6iXfSSIAbPgxRNdRw&id=${id}`)
      .then(result =>
          parseString(result, (err, goodreadsResult) =>{
          const numPages =goodreadsResult.GoodreadsResponse.book[0].num_pages[0];
          const pages = numPages ? parseInt(numPages, 10) : 0;
            res.json({
              pages
               
                });
            })
        );
       
  })

 export default router;

 