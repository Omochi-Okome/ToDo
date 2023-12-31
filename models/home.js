const mongodb = require('mongodb');
const  getDb = require('../util/database').getDb;
/////////////////////////////////////

class CommonDbOperation {
  constructor(collectionName,item,_id){
    this.collectionName = collectionName;
    this.item = item;
    this._id;
  }
  writeDB() {
    const db = getDb();
    const collection = db.collection(this.collectionName);
    if(this._id){
      return collection
        .updateOne({_id: new mongodb.ObjectId(this._id)},{ $set: { postItem: this.postItem } })
        .then(result => {
          //console.log(result)
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      return collection
        .insertOne(this.item)
        .then(result => {
          //console.log(result)
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  fetchAll() {
    const db = getDb();
    return db.collection(this.collectionName)
      .find()
      .toArray()
  }
}

class homeItem {
  constructor({postItem,_id}) {
    this.postItem = postItem;
    this._id = _id;
  }

  //DBのproductsへ保存
  saveProducts() {
    const operation = new CommonDbOperation('products',{postItem:this.postItem},this._id);
    return operation.writeDB();
  }
  
  static fetchAll(){
      const operation = new CommonDbOperation('products',{postitem:this.postItem},this._id);
      return operation.fetchAll()
      .then(products => {
        // console.log(products);
        return products.map(product => new homeItem(product));
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  }
};
//////////////////////////////////////////////////////////////
class removeItem {
  constructor(itemDelete,_id) {
    this.itemDelete = itemDelete;
    this._id =_id;
  }

  saveArchive(){
    const operation = new CommonDbOperation('archive',{itemDelete:this.itemDelete.itemDelete},this._id);
    return operation.writeDB();
  }
  fetchAll(){
    const operation = new CommonDbOperation('archive',{itemDelete:this.itemDelete},this._id)
    return operation.fetchAll()
      .then(collectionName => {
        // console.log('Fetched archive data:', archive);
        return collectionName.map(item => new removeItem(item.itemDelete, item._id)); // ネストから解放
      })
      .catch(err => {
        console.log('Error fetching archive data:', err);
        throw err;
      });
  }

  static deleteById(itemDelete) {
    const db = getDb();
    //itemDeleteはStringになっている。
    // console.log(itemDelete);
    return db
      .collection('products')
      .deleteOne({postItem:itemDelete})
      .then(result => {
        // console.log('Deleted');
      })
      .catch(err => {
        console.log(err);
      });
  }
  
}

class archive {
  constructor(archiveDelete,_id) {
    this.archiveDelete = archiveDelete;
    this._id = _id;
  }

  static deleteById(archiveDelete) {
    const db = getDb();
    // console.log(archiveDelete);
    return db
      .collection('archive')
      .deleteOne({itemDelete:archiveDelete})
      .then(result => {
        // console.log('Deleted');
      })
      .catch(err => {
        console.log(err);
      });
  }
}

class returnHome {
  constructor(returnArchive,_id) {
    this.returnArchive = returnArchive;
    this._id = _id;
  }
  saveProducts() {
    const operation = new CommonDbOperation('products',{postItem:this.returnArchive},this._id);
    return operation.writeDB();
    }
  
}

class editText {
  constructor(editedText,originalText,_id) {
    this.editedText = editedText;
    this.originalText = originalText;
    this._id = _id;
  }
  saveProducts() {
    const operation = new CommonDbOperation('products',{postItem:this.editedText},this._id);
    return operation.writeDB();
    }
  static deleteById(originalText) {
    const db = getDb();
    // console.log(itemDelete);
    return db
      .collection('products')
      .deleteOne({postItem:originalText})
      .then(result => {
        // console.log('Deleted');
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = { homeItem, removeItem ,archive,returnHome,editText};