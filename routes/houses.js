const { Router } = require("express");
const asyncHandler = require("express-async-handler");
const House = require("../models/house");

const houses = Router();

houses.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 8;

    // Destructure the filter parameters from the request query
    const {
      province,
      district,
      sector,
      cell,
      village,
      priceMin,
      priceMax,
      bedrooms,
      isAvailable,
    } = req.query;

    // Dynamically build the query object
    const query = {};
    // Address filtering
    if (province) {
      query["address.province"] = { $regex: province, $options: "i" };
      console.log("using province", province);
    } else {
      console.log("No province query");
    }
    if (district) {
      query["address.district"] = { $regex: district, $options: "i" };
      console.log("using district", district);
    } else {
      console.log("No district query");
    }
    if (sector) {
      query["address.sector"] = { $regex: sector, $options: "i" };
      console.log("using sector", sector);
    } else {
      console.log("No sector query");
    }
    if (cell) {
      query["address.cell"] = { $regex: cell, $options: "i" };
      console.log("using cell", cell);
    } else {
      console.log("No cell query");
    }
    if (village) {
      query["address.village"] = { $regex: village, $options: "i" };
      console.log("using village", village);
    } else {
      console.log("No village query");
    }

    console.log("query to mongodb", query);
    console.log("for page", page);

    try {
      // Fetch the filtered houses with pagination
      const housesList = await House.find(query)
        .skip((page - 1) * pageSize)
        .limit(pageSize);
      console.log(housesList);
      res.status(200).send(housesList);
    } catch (err) {
      console.error("Error fetching houses:", err);
      res
        .status(500)
        .send({ message: "Error fetching houses", error: err.message });
    }
  })
);

module.exports = houses;
