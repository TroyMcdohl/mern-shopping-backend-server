const User = require("../model/User");
const AppError = require("../error/AppError");
const jwt = require("jsonwebtoken");
const Email = require("../email/email");
const crypto = require("crypto");
const multer = require("multer");
const sharp = require("sharp");

const filterObj = (obj, ...allowedFields) => {
  let newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getAllUser = async (req, res, next) => {
  try {
    const users = await User.find();

    if (!users) {
      return next(new AppError("Users not found", 404));
    }

    res.status(200).json({
      status: "success",
      users,
    });
  } catch (error) {
    next(error);
  }
};

exports.signup = async (req, res, next) => {
  const newUser = await User.create(req.body);

  if (!newUser) {
    next(new AppError("User cannot be create", 400));
  }

  try {
    await new Email(newUser).welcome();

    res.status(200).json({
      status: "success",
      message: "Email send successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (
      !user ||
      !(await user.correctPassword(req.body.password, user.password))
    ) {
      return next(new AppError("User not found", 400));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRECT);

    res.cookie("jwt", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 3600 * 1000),

      sameSite: "none",
      secure: true,
    });

    const { password, ...otherDetail } = user._doc;

    res.status(200).json({
      status: "success",
      otherDetail,
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 5 * 1000),

    secure: true,
  });

  res.status(200).json({ status: "success" });
};

exports.protect = async (req, res, next) => {
  if (!req.cookies.jwt) {
    return next(new AppError("You need to login", 400));
  }

  const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRECT);

  const currentUser = await User.findOne({ _id: decoded.id });

  if (!currentUser) {
    return next(new AppError("User not found", 404));
  }

  req.user = currentUser;

  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You are not allowed to do this.", 400));
    }

    next();
  };
};

exports.updateMe = async (req, res, next) => {
  try {
    if (req.body.password || req.body.confirmPassword) {
      return next(new AppError("Can't change password here", 400));
    }

    const filterUpdate = filterObj(req.body, "name", "email");

    if (req.file) {
      filterUpdate.photo = "public/img/users/" + req.file.filename;
    }

    const user = await User.findByIdAndUpdate(req.user._id, filterUpdate, {
      new: true,
    });

    const { password, ...otherDetail } = user._doc;

    res.status(200).json({
      status: "success",
      otherDetail,
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (
      !user ||
      !(await user.correctPassword(req.body.oldPassword, user.password))
    ) {
      return next(new AppError("User not found", 400));
    }

    user.password = req.body.newPassword;
    user.confirmPassword = req.body.confirmPassword;

    await user.save();

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const resetToken = await user.createResetToken();

  await user.save({ validateBeforeSave: false });

  const resetURL = `https://mern-shopping-ui.herokuapp.com/resetpassword/${resetToken}`;

  try {
    await new Email(user, resetURL).changeForgotPassword();

    res.status(200).json({
      status: "success",
      message: "Email send successfully",
      user: user,
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("There is an error sending email,try again", 500));
  }
};

exports.resetPassword = async (req, res, next) => {
  const token = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("You can't update password", 400));
  }

  user.password = req.body.newPassword;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({
    status: "success",
  });
};

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Please upload a image", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.uploadResizePhoto = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

exports.userStats = async (req, res, next) => {
  try {
    const userAmount = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date("2022-01-1"),
            $lte: new Date("2022-12-30"),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(userAmount);
  } catch (err) {
    next(err);
  }
};
