//Student Name: Zhouxuan He
//Student Id: 301120369
//Web App & DB Name: book_website


// create a reference to the model
const { listen } = require('../config/app');
let Book = require('../models/book');

// Gets all books from the Database and renders the page to list all books.
module.exports.bookList = function(req, res, next) {  
    Book.find((err, bookList) => {
        // console.log(bookList);
        if(err)
        {
            return console.error(err);
        }
        else
        {
            res.render('book/list', {
                title: 'Book List', 
                books: bookList
            })            
        }
    });
}

// Gets a book by id and renders the details page.
module.exports.details = (req, res, next) => {
    
    let id = req.params.id;

    Book.findById(id, (err, bookToShow) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //show the details view
            res.render('book/details', {
                title: 'Book Details', 
                book: bookToShow
            })
        }
    });
}

// Renders the Add form using the add_edit.ejs template
module.exports.displayAddPage = (req, res, next) => {
    //render the add_edit page with blank values
    res.render('book/add_edit', {
        title: 'Add Book', 
        book: {
            "Title": "",
            "Description": "",
            "Price": null,
            "Author": "",
            "Genre": ""
        }
    });     

}

// Processes the data submitted from the Add form to create a new book
module.exports.processAddPage = (req, res, next) => {
    //Object of details of new Added book
    let thisBook = {
        "Title": req.body.Title,
        "Description": req.body.Description,
        "Price": req.body.Price,
        "Author": req.body.Author,
        "Genre": req.body.Genre
    }

    //Create method to add it to DB
    Book.create(thisBook, (err, doc) =>{
        if(err) console.log(err);
        else console.log(doc);
    })

    //Return to Book Details Page
    res.render('book/details', {
    title: 'Book Added', 
    book: thisBook
});


}

// Gets a book by id and renders the Edit form using the add_edit.ejs template
module.exports.displayEditPage = (req, res, next) => {
    let id = req.params.id;
    //Find detials of current book by id
    Book.findById(id, (err, bookToShow) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //show the edit view
            res.render('book/add_edit', {
                title: 'Edit Book', 
                book: bookToShow
            })
        }
    });
}

// Processes the data submitted from the Edit form to update a book
module.exports.processEditPage = (req, res, next) => {
    //get book id
    let id = req.params.id;
    //create object of details of edited book
    let thisBook = {
        "Title": req.body.Title,
        "Description": req.body.Description,
        "Price": req.body.Price,
        "Author": req.body.Author,
        "Genre": req.body.Genre
    };
    //Update by id
    Book.collection.updateOne({_id: require("mongodb").ObjectId(id)}, {$set:thisBook}, {upsert: false});
    
    //Return to details view
    res.render('book/details', {
        title: 'Book Edited', 
        book: thisBook
    });    
}

// Deletes a book based on its id.
module.exports.performDelete = (req, res, next) => {
    let id = req.params.id;

    //delete by id
    Book.collection.deleteOne({_id: require("mongodb").ObjectId(id)});

    //Return to Book List Page
    Book.find((err, bookList) => {
        // console.log(bookList);
        if(err)
        {
            return console.error(err);
        }
        else
        {
            res.render('book/list', {
                title: 'Book List', 
                books: bookList
            })            
        }
    });

}