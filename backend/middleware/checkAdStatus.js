// middleware/checkAdStatus.js
export const checkAdStatus = (req, res, next) => {
  req.filterActiveAds = true;
  next();
};
