const cities = require('./cities');
const { names, centers, centerEnd } = require('./seedHelpers');
const mongoose = require('mongoose');
const Center = require('../models/center');

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
  await Center.deleteMany({});
  for (let i = 0; i < 150; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const yearEst = Math.floor(Math.random() * 51) + 1970;
    const phone = Math.floor(Math.random) * 10;

    const center = new Center({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      name: `${sample(centers)} ${sample(centerEnd)}`,
      author: '61270c67881c5847f252d2e5',
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum animi similique velit ratione vitae amet tempore ex accusamus optio ab fugiat, blanditiis explicabo neque. Nemo corrupti sapiente expedita animi Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur pariatur ad, nemo exercitationem obcaecati quos expedita error totam porro ex deleniti corrupti repellat assumenda ea fuga facilis ut aspernatur veritatis.`,
      yearEst,
      email: `${sample(names)}@yelpcat.com`,
      phone: phone,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dzqcxevcq/image/upload/v1630952965/YelpCat/photo-1615694547744-f100c242a3a8_qekg2l.jpg',
          filename: 'YelpCat/photo-1615694547744-f100c242a3a8_qekg2l',
        },
      ],
    });
    await center.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
