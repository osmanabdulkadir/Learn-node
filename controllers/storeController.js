const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const { response } = require('express');

const multerOptions = {
   storage: multer.memoryStorage(),
   fileFilter(req,file,next) {
     const isPhoto = file.mimetype.startsWidth('image/');
     if(isPhoto) {
       next(null, true);
     } else {
       next({ message: 'That filetype isn\'t allowed ' })
     }
   }
};

exports.homePage = (req, res) => {
  console.log(req.name);
  req.flash('error', 'Something Happened');
  req.flash('error', 'Another thing happened');
  req.flash('error', 'Oh No!!!');
  req.flash('info', 'Something Happened');
  req.flash('warning', 'Something Happened');
  req.flash('success', 'Something Happened');
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req,res,next) =>  {
  //check if no new file to resize
  if(!req.file) {
    next(); // skip to the next middleware
    return;
  }
  
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // now we resize 
  const photo = await jimp.read(req.body.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  // once we have writtem the photo to our filesyystem, keep goin.
  next();
}

exports.createStore = async (req, res) => {
  const store = new Store(req.body);
  await store.save();
  req.flash('success', `Succesfully Created ${store.name} . care to add a revirew`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async(req,res) => {
    const store =  await Store.find();
    res.render('stores', {title: 'Stores'})
};

exports.editStore = async (req, res) => {
    // find the store given the id
    const store = await Store.findOne({_id: req.params.id});
    res.json(store);
    //2, confirm they are the owner of the store
    //3. render out the edit form so the user can update thier store
    res.render('editStore', {title: `Edit ${store.name}`, store})
};

exports.updateStore = async (req,res) => {
  // set the locaion data to be a point
  req.body.location.type = 'Point';
  //find and update the store
    const store = await Store.findByIdAndUpdate({_id: req.params.id}, req.body, {
        new: true,
        runValidators: true
    }).exec();
    req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href='/stores/${store.slug}"> View Store </a>`);
    res.redirect(`/stores/${store._id}/edit`);

}

exports.getStoreBySlug = async (req,res,next) => {
  const store = await Store.findOne({ slug: req.params.slug});
  if(!store) {
    next();
    return;
  }
 
}

exports.getStoreByTag = async (req,res) => {
  const tag = req.params.tag;
 const tagQuery = tag || { $exists: true};
  const tagsPromise =  Store.getTagsList();
  const storesPromise = Store.find({ tags: tag})
  const [tags, stores ] = Promise.all([tagsPromise, storesPromise]);
 


  
  res.render('tag', {tags, title: 'Tags', tag })
}