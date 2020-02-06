const fs = require('fs');
const Jimp = require('jimp');
const resizeOptimizeImages = require('resize-optimize-images');

const sizes = [400, 480, 640, 960, 1280, 1920]
const source = './originals/';

var app = {

	originals: [],

	database: [],

	init: async() => {

		for await (const folder of sizes) {

			console.log(folder)

			if (!fs.existsSync(folder.toString())){

			    fs.mkdirSync(folder.toString());

			}
		}

		app.load()

	},

	load: async() => {

		fs.readdir(source, (err, files) => {

		  files.forEach(file => {

		     app.originals.push(file);

		  });

		  app.resize()

		});

	},

	checkURL: (url) => {
	    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
	},

	resize: async() => {

		for await (const image of app.originals) {

			if (app.checkURL(image)) {

				for await (const size of sizes) {

					app.boomer(image, size, 90) //.then( (resp) => console.log(resp) )

				}
			}
		}
	},

	boomer: async(images, width, quality, height = Jimp.AUTO ) => {

		  try {
				const image = await Jimp.read(`./originals/${images}`);
				await image.resize(width, height);
				await image.quality(quality);
				await image.writeAsync(`./${width}/${images}`);
		  } catch(err) {
		    // catches errors both in fetch and response.json
		    console.log(err);
		  }

		  //return "Boom"

	},

	optimize: async(images, width, quality) => {

		const options = {
			images: ['path/to/image.jpg', 'path/to/image.png'],
			width: width,
			quality: quality
		};

		try {
			await resizeOptimizeImages(options);
		} catch(err) {
			// catches errors both in fetch and response.json
			console.log(err);
		}
	}

	/*
	boomer: async(images, width, quality, height = Jimp.AUTO ) => {
		await Promise.all(
			images.map(async imgPath => {
				const image = await Jimp.read(`./big/${imgPath}`);
				await image.resize(width, height);
				await image.quality(quality);
				await image.writeAsync(`./resized/${imgPath}`);
			})
		);
	}
	*/
}


app.init()