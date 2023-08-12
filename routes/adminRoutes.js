const express=require("express")
const adminroutes=express.Router()
const adminController=require('../controles/adminController')
const authMidlewareadmin=require("../middleware/authMidlewareadmin")


adminroutes.post('/login',adminController.adminLogin)
adminroutes.post('/getAdmin',authMidlewareadmin,adminController.getAdmin)
adminroutes.post('/addlocation',adminController.addlocation)
adminroutes.post('/getlocation',adminController.getLocation)
adminroutes.get('/getGuide',adminController.getGuide)
adminroutes.post('/getdetails',adminController.guideDetails)
adminroutes.post('/verifyguide',adminController.changeStatus)
adminroutes.post('/editlocation',adminController.editLocation)

module.exports=adminroutes