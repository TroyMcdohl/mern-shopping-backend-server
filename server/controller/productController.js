const Product = require("../model/Product");
const AppError = require("../error/AppError");
const multer = require("multer");
const sharp = require("sharp");

exports.getAllProduct = async (req, res, next) => {
  try {
    let products = Product.find(req.query);

    if (req.query.sort) {
      products = Product.find().sort(req.query.sort);
    }

    console.log(req.query.sort);

    if (!products) {
      return next(new AppError("Products not found", 404));
    }

    const allProducts = await products;

    res.status(200).json({
      status: "success",
      allProducts,
    });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);

    if (!newProduct) {
      return next(new AppError("New Product can't create", 400));
    }

    res.status(201).json({
      status: "success",
      newProduct,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.pid);

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    res.status(200).json({
      status: "success",
      product,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.pid, req.body, {
      new: true,
    });

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    res.status(200).json({
      status: "success",
      product,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.pid);

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    res.status(200).json({
      status: "success",
      product,
    });
  } catch (error) {
    next(error);
  }
};

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Please upload an image", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProductImages = upload.fields([
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeUploadProductImages = async (req, res, next) => {
  if (!req.files) {
    return next(new AppError("need to upload image", 400));
  }

  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `product-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(1100, 1407)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/products/${filename}`);

      req.body.images.push("public/img/products/" + filename);
    })
  );

  next();
};
