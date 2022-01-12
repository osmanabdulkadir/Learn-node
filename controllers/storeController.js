const mongoose = require('mongoose');
const Store = mongoose.model('Store');

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
    const store = await Store.findByIdAndUpdate({_id: req.params.id}, req.body, {
        new: true,
        runValidators: true
    }).exec();
    req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href='/stores/${store.slug}"> View Store </a>`);
    res.redirect(`/stores/${store._id}/edit`);

}
