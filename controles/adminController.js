const Admin = require("../model/adminModel");
const Guide = require("../model/guideModel");
const GuideDetails = require("../model/guideDetailsModel");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const Location = require("../model/locationModel");

const adminLogin = async (req, res) => {
  try {
    // const password = req.body.password;
    // console.log(password)
    // const salt = await bcrypt.genSalt(10);
    // const hashPassword = await bcrypt.hash(password, salt);
    // console.log(hashPassword)
    // req.body.password = hashPassword;
    const admin = await Admin.findOne({ email: req.body.email });
    //   console.log(admin)

    if (!admin) {
      return res
        .status(200)
        .send({ message: "please enter the valid details", success: false });
    }
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      admin.password
    );

    if (!passwordMatch) {
      return res
        .status(200)
        .send({ message: "please check your password", success: false });
    } else {
      const admintoken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res
        .status(200)
        .send({ message: "login successful", success: true, data: admintoken });
    }
  } catch (error) {
    res.status(500).send({ message: "error in login", success: false, error });
  }
};

const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ _id: req.body.admin });

    if (!admin) {
      return res
        .status(200)
        .send({ message: "enter the correct details", success: false });
    } else {
      res
        .status(200)
        .send({ message: "welome to home", success: true, data: admin.email });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "error geting guideinfo", success: false, error });
  }
};

const addlocation = async (req, res) => {
  try {
    const District = req.body.district;
    const state = await Location.findOne({
      state: { $regex: new RegExp("^" + req.body.state, "i") },
    });
    console.log("1", state);

    if (state) {
      const district = await Location.findOne({
        state: { $regex: new RegExp("^" + req.body.state, "i") },
        district: {
          $elemMatch: { $regex: new RegExp("^" + req.body.district, "i") },
        },
      });

      console.log("dis", district);
      console.log(req.body.district);

      if (district) {
        return res
          .status(200)
          .send({ message: "Location already exist", success: false });
      } else {
        const addistrict = await Location.findOneAndUpdate(
          { state: req.body.state },
          { $push: { district: req.body.district } }
        );

        res.status(200).send({ message: "Location added", success: true });
      }
    } else {
      const newlocation = new Location(req.body);

      const location = await newlocation.save();

      res.status(200).send({ message: "Location added", success: true });
    }
  } catch (error) {
    res.status(500).send({ message: "Place added", success: false });
  }
};

const getLocation = async (req, res) => {
  try {
    const location = await Location.find();
    console.log("hi" + location);
    let a = [];
    for (let i = 0; i < 2; i++) {
      a[i] = location[i].state;
    }
    console.log(a);
    res.status(200).send({ success: true, data: location });
  } catch (error) {}
};
const getGuide = async (req, res) => {
  try {
    const guide = await Guide.find({});

    if (guide) {
      res.status(200).send({ data: guide });
    }
  } catch (error) {
    res.status(500).send({ data: error });
  }
};
const guideDetails = async (req, res) => {
  try {
    const details = await GuideDetails.findOne({ guidid: req.body.id });

    res.status(200).send({ data: details });
  } catch (error) {
    res.status(500).send(error);
  }
};

const changeStatus = async (req, res) => {
  console.log("hieb");
  try {
    console.log("hello");
    const update = await Guide.findOneAndUpdate(
      { _id: req.body.id },
      { $set: { isAdminverified: true } }
    );
    if (update) {
      res.status(200).send({ message: "Verification success", success: true });
    } else {
      res.status(200).send({ message: "check it again", success: false });
    }
  } catch (error) {
    res.status(500).send({ message: "something wents wrong" });
  }
};
const editLocation = async (req, res) => {
   const district=req.body.districts
   console.log("district",district)
  try {
   const location=await Location.findOneAndUpdate({_id:req.body.id},{$set:{state:req.body.state,district:district}})
   if(location){
      res.status(200).send({message:"Location updated",success:true})
   }
   else{
      res.status(200).send({message:"please check your details"})
   }
  } catch (error) {
   res.status(500).send({message:"some thing went wrong"})
  }
};

module.exports = {
  adminLogin,
  getAdmin,
  addlocation,
  getLocation,
  getGuide,
  guideDetails,
  changeStatus,
  editLocation,
};
