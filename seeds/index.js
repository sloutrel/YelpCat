const cities = require("./cities");
const {
  names,
  descriptors,
  colors,
  personalities,
  animals,
} = require("./seedHelpers");
const mongoose = require("mongoose");
const Cat = require("../models/cat");

mongoose.connect("mongodb://localhost:27017/yelp-cat", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, `error`));
db.once("open", () => {
  console.log(`db conected`);
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Cat.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 150);
    const age = Math.floor(Math.random() * 25);
    const cat = new Cat({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      name: `${sample(names)}`,
      age,
      headline: `${sample(descriptors)} ${sample(colors)} ${sample(
        personalities
      )} ${sample(animals)}`,
      image: `https://source.unsplash.com/collection/7469319`,
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum animi similique velit ratione vitae amet tempore ex accusamus optio ab fugiat, blanditiis explicabo neque. Nemo corrupti sapiente expedita animi Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur pariatur ad, nemo exercitationem obcaecati quos expedita error totam porro ex deleniti corrupti repellat assumenda ea fuga facilis ut aspernatur veritatis.`,
      price,
    });
    await cat.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
