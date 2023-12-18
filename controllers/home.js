const fs = require("fs");
const {Product,ss} = require("../models/home");
let active = false;
let editActive = true;

exports.getHome = (req,res) => {
  Product.fetchAll()
    .then(products => {
      res.render('../views/home.ejs',{
        data:products,
        active:active,
        editActive:editActive,
      });
    })
    .catch(err => {
      console.log(err);
    });
}

//modelsに移植済み
exports.postItem = (req,res) => {
    //ToDoItemは入力された値
    const postItem = req.body.ToDoItem;
    console.log(postItem);
    const product = new Product({postItem});
    product.home_save();
    res.redirect('/');
}

exports.deleteItem = (req, res) => {
  const itemDelete = req.body.itemToDelete;
  const product = new ss({itemDelete});
  product.home_delete();

  // ss.deleteById(itemDelete)
  //   .then(() => {
  //     console.log('Destroyed item');
  //   })
  //   .catch(err => console.log(err));
  

  // console.log(itemDelete);
  // const product = new ss(itemDelete);
  // product.home_delete();
  res.redirect('/');
};

exports.editButton = (req,res) => {
  active =true;
  editActive = false;
  res.redirect('/');
}

exports.editItem = (req, res) => {
  const editedText = req.body.editedText;
  const originalText = req.body.originalText;
  const readingJSON = JSON.parse(fs.readFileSync("data.json", "utf8"));

  const product = new Product({editedText});
  product.home_save();

  const index = readingJSON.indexOf(originalText);
  if (index !== -1) {
    readingJSON.splice(index, 1, editedText);
    fs.writeFileSync("data.json", JSON.stringify(readingJSON));
    } else {
    console.error('指定された要素が見つかりませんでした。');
    }
    editActive = true;
    active = false;
    res.redirect('/');
  }

  //以下アーカイブ関連
  exports.viewArchive = (req,res) => {
    ss.fetchAll()
    .then(archive => {
      console.log(archive)
      res.render("../views/archive.ejs",{
      data:archive,
      active:active,
      editActive:editActive,
    })  
  })
  .catch(err => {
      console.log(err);
    });
}

exports.deleteArchive = (req,res) => {
    const archiveToDelete = req.body.archiveToDelete;
    const readingArchiveJSON = JSON.parse(fs.readFileSync("archive.json","utf8"));

    const index = readingArchiveJSON.indexOf(archiveToDelete);
    if(index !== -1) {
      readingArchiveJSON.splice(index,1);
      fs.writeFileSync("archive.json",JSON.stringify(readingArchiveJSON));
    }
    res.redirect('/archive');
}

exports.returnMain = (req,res) => {
  const returnObject = req.body.returnArchive;
  const readingArchiveJSON = JSON.parse(fs.readFileSync("archive.json",'utf8'));
  const readingDataJSON = JSON.parse(fs.readFileSync("data.json","utf8"));
  const index = readingArchiveJSON.indexOf(returnObject);
  const addData = readingArchiveJSON[index];

  if(index !== -1){
    readingArchiveJSON.splice(index,1);
    readingDataJSON.push(addData);
    fs.writeFileSync("archive.json",JSON.stringify(readingArchiveJSON));
    fs.writeFileSync("data.json",JSON.stringify(readingDataJSON));
  }
  res.redirect('/archive');
}