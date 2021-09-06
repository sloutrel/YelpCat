const cities = require('./cities');
const {
  names,
  descriptors,
  colors,
  personalities,
  animals,
  species,
  // dbßs,
} = require('./seedHelpers');
const mongoose = require('mongoose');
const Animal = require('../models/animal');

mongoose.connect('mongodb://localhost:27017/yelp-cat', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, `error`));
db.once('open', () => {
  console.log(`db conected`);
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Animal.deleteMany({});
  for (let i = 0; i < 10; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 150);
    const age = Math.floor(Math.random() * 25);
    const animal = new Animal({
      name: `${sample(names)}`,

      age,
      breed: 'unknown',
      species: `${sample(species)}`,
      description: `${sample(descriptors)} ${sample(colors)} ${sample(
        personalities
      )} ${sample(
        animals
      )} Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum animi similique velit ratione vitae amet tempore ex accusamus optio ab fugiat, blanditiis explicabo neque. Nemo corrupti sapiente expedita animi Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur pariatur ad, nemo exercitationem obcaecati quos expedita error totam porro ex deleniti corrupti repellat assumenda ea fuga facilis ut aspernatur veritatis.`,
      price,
      // center: [`${sample(dbs)}`],
      images: [
        {
          url: 'https://res.cloudinary.com/dzqcxevcq/image/upload/v1630282242/YelpCat/m3nezzc1cq4mdwtiteat.jpg',
          filename: 'YelpCat/m3nezzc1cq4mdwtiteat',
        },
        {
          url: 'https://res.cloudinary.com/dzqcxevcq/image/upload/v1630281184/YelpCat/wfr1ru1dzen5nhicxd7c.jpg',
          filename: 'YelpCat/wfr1ru1dzen5nhicxd7c',
        },
      ],
    });
    await animal.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
