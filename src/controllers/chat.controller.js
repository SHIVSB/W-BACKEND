const Chat = require("../models/chat.model");
const auth = require("../utils/authentication");
const validateMongodbId = require("../utils/validateMongodbID");
const expressAsyncHandler = require("express-async-handler");

const chatController = {};

chatController.createChat = expressAsyncHandler(async (req, res) => {
  let responseData = {
    msg: "Error in creating new message",
    success: false,
    result: "",
  };
  const { content } = req.body;

  try {
    const newMessage = await Chat.create({
      content: content,
    });

    responseData.msg = "Message created successfully";
    responseData.success = true;
    responseData.result = newMessage;

    return res.status(200).send(responseData);
  } catch (error) {
    console.log("error in creating the message");

    return res.status(500).send(responseData);
  }
});

chatController.getChat = expressAsyncHandler(async (req, res) => {
  let responseData = {
    msg: "Error in fetching message",
    success: false,
    result: "",
  };

  try {
    const allMessage = await Chat.find({});
    responseData.msg = "Message fetched successfully";
    responseData.success = true;
    responseData.result = allMessage;

    return res.status(200).send(responseData);
  } catch (error) {
    console.log("error in fetching the message");

    return res.status(500).send(responseData);
  }
});
module.exports = chatController;
