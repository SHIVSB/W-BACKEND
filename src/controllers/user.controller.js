const User = require("../models/user.model");
const auth = require("../utils/authentication");
const validateMongodbId = require("../utils/validateMongodbID");
const expressAsyncHandler = require("express-async-handler");
const crypto = require("crypto");
const fs = require("fs");
const cloudinaryUploadImg = require("../utils/cloudinary");

const userController = {};

userController.signup = expressAsyncHandler(async (req, res) => {
  let responseData = {
    msg: "Error in creating the user",
    success: false,
    result: "",
  };
  const { firstName, lastName, email, password } = req.body;
  //check if user exist
  const userExists = await User.findOne({ email });

  if (userExists) throw new Error("User already exists");

  try {
    const newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    });

    responseData.msg = "User created successfully";
    responseData.success = true;
    responseData.result = newUser;

    return res.status(200).send(responseData);
  } catch (error) {
    console.log("error in creating the user");

    return res.status(500).send(responseData);
  }
});

userController.signin = async (req, res) => {
  let data = req.body;

  let responseData = {
    msg: "Error in signing in the user",
    success: false,
    result: "",
  };

  if (data.email && data.password) {
    try {
      const userFound = await User.findOne({ email: data.email });
      // console.log(data.email);
      //console.log(data.password);

      if (await userFound.isPasswordMatched(data.password)) {
        responseData.msg = "User logged in successfully";
        responseData.success = true;
        responseData.result = userFound;
        responseData.token = auth.generateToken(userFound._id);
        return res.status(200).send(responseData);
      } else {
        return res.status(500).send(responseData);
      }
    } catch (error) {
      console.log("Inavlid email or password");
      responseData.msg = "Inavlid email or password";
      return res.status(500).send(responseData);
    }
  } else {
    responseData.msg = "Insufficient data for login";

    return res.status(500).send(responseData);
  }
};

userController.getUser = async (req, res) => {
  const { _id } = req.user;

  let responseData = {
    msg: "User profile could not be fetched",
    success: false,
    result: "",
  };

  validateMongodbId(_id);
  try {
    const user = await User.findById(_id);

    responseData.msg = "User fetched successfully";
    responseData.success = true;
    responseData.result = user;

    return res.status(200).send(responseData);
  } catch (error) {
    return res.status(500).send(responseData);
  }
};
userController.profilePhotoUpload = expressAsyncHandler(async (req, res) => {
  // console.log(req.file);

  //console.log(req.user);

  const { _id } = req.user;

  //getting path to the image
  const localPath = `public/images/profile/${req.file.filename}`;

  //uploading to cloudinary

  const imgUploaded = await cloudinaryUploadImg(localPath);

  const foundUser = await User.findByIdAndUpdate(
    _id,
    {
      profilePhoto: imgUploaded.url,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  //remove the saved img
  fs.unlinkSync(localPath);
  console.log(imgUploaded);
  res.json(imgUploaded);
  let responseData = {
    msg: "File uploaded successfully",
    success: true,
    result: imgUploaded,
  };

  return res.status(200).send(responseData);
});

userController.setBubbleColor = expressAsyncHandler(async (req, res) => {
  let responseData = {
    msg: "Error in updating the user",
    success: false,
    result: "",
  };

  const { _id } = req.user;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        bubbleColor: req.body.bubbleColor,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    responseData.msg = "User bubble color updated successfully";
    responseData.success = true;
    responseData.result = updatedUser;

    return res.status(200).send(responseData);
  } catch (error) {
    return res.status(500).send(responseData);
  }
});

userController.setGradientColor = expressAsyncHandler(async (req, res) => {
  let responseData = {
    msg: "Error inupdating the user",
    success: false,
    result: "",
  };

  const { _id } = req.user;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        gradientFrom: req.body.gradientFrom,
        gradientTo: req.body.gradientTo,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    responseData.msg = "User gradient color updated successfully";
    responseData.success = true;
    responseData.result = updatedUser;

    return res.status(200).send(responseData);
  } catch (error) {
    return res.status(500).send(responseData);
  }
});

module.exports = userController;
