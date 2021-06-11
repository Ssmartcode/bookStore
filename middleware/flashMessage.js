const flashMessage = (req, res, next) => {
  const flash = req.flash();
  if (Object.keys(flash).length === 0) return next();

  const flashMessages = [];

  Object.keys(flash).forEach((messageType) => {
    // give only first message of each type
    flashMessages.push({
      type: messageType,
      text: flash[messageType][0],
    });
  });

  res.locals.flashMessages = flashMessages;
  return next();
};

module.exports = flashMessage;
