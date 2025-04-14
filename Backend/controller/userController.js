import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, aadhar, dob, gender, password } = req.body;
    if (!firstName ||
        !lastName ||
        !email ||
        !phone ||
        !aadhar ||
        !dob ||
        !gender ||
        !password
    ) {
        return next(new ErrorHandler("Please Fill Full Form!", 400));
    }

    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorHandler("User already Registered!", 400));
    }

    user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        aadhar,
        dob,
        gender,
        password,
        role: "Patient",
    });
    generateToken(user, "User Registered successfully", 200, res);
    
});

export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password, confirmPassword, role } = req.body;

    if (!email || !password || !confirmPassword || !role) {
        return next(new ErrorHandler("Please Provide All Fields!", 400));
    }
    if (password !== confirmPassword) {
        return next(new ErrorHandler("Password and Confirm Password Do Not Match", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password!",400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password!",400));
    }
    if(user.role !== role){
        return next(new ErrorHandler("User with this Role not Found!",400));
    }
     
    generateToken(user, "User Logged In successfully", 200, res);

});

export const addNewAdmin = catchAsyncErrors(async (req , res, next) =>{
    const {firstName, lastName, email, phone, aadhar, dob, gender, password} = req.body;
    if (!firstName ||
        !lastName ||
        !email ||
        !phone ||
        !aadhar ||
        !dob ||
        !gender ||
        !password
    ) {
        return next(new ErrorHandler("Please Fill Full Form!", 400));
    }

    const isRegistered = await User.findOne({ email });
    if(isRegistered){
        // return next(new ErrorHandler("Admin already Exists!",400));
        return next(new ErrorHandler(`${isRegistered} with this email already Exists!`));
    }

    const admin = await User.create({
        firstName,
        lastName,
        email,
        phone,
        aadhar,
        dob,
        gender,
        password,
        role: "Admin",
    });
    res.status(200).json({
        success: true, 
        message: "New Admin created Successfully",
    });


});

export const getAllDoctors = catchAsyncErrors(async (req , res , next) =>{
    const doctors = await User.find({ role: "Doctor" });
    res.status(200).json({
        success: true,
        doctors,
    });
});

export const getUserDetails = catchAsyncErrors(async(req , res, next) =>{
    const user = req.user;
    res.status(200).json({
        sucess: true,
        user,
    });
});

export const logoutAdmin = catchAsyncErrors(async(req , res ,next) =>{
    res
      .status(200)
      .cookie("adminToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .json({
        success:true,
        message: "Admin Logged out Successfully",
    });
});

export const logoutPatient = catchAsyncErrors(async(req , res ,next) =>{
    res
      .status(200)
      .cookie("patientToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .json({
        success:true,
        message: "Patient Logged out Successfully",
    });
});

export const addNewDoctor = catchAsyncErrors(async (req , res , next) => {
    // console.log("🔍 Request Received");//debugging
    if (!req.files || Object.keys(req.files).length === 0) {
        // console.log("❌ No file found");//debugging
        return next(new ErrorHandler("Doctor Avatar Required!", 400));
    }
    const { docAvatar } = req.files;
    // console.log("📦 docAvatar:", docAvatar);//debugging

    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(docAvatar.mimetype)) {
        // console.log("❌ Unsupported format:", docAvatar.mimetype);//debugging
        return next(new ErrorHandler("File Format Not Supported!", 400));
    }

    const { firstName, lastName, email, phone, aadhar, dob, gender, password, doctorDepartment } = req.body;
    // console.log("🧾 Body:", req.body);//debugging

    if (!firstName ||
        !lastName ||
        !email ||
        !phone ||
        !aadhar ||
        !dob ||
        !gender ||
        !password ||
        !doctorDepartment ||
        !docAvatar
    ) {
        return next(new ErrorHandler("Please Fill Full Form!", 400));
    }

    const isRegistered = await User.findOne({ email });
       if (isRegistered) {
          return next(
            new ErrorHandler("Doctor With This Email Already Exists!", 400)
        );
    }  
    const cloudinaryResponse = await cloudinary.uploader.upload(
        docAvatar.tempFilePath
    ); 
    // console.log("🧾 Body:", req.body);//debugging
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
          "Cloudinary Error:",
          cloudinaryResponse.error || "Unknown Cloudinary error"
        );
        return next(
          new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
        );
    }

    const doctor = await User.create({
        firstName,
        lastName,
        email,
        phone,
        aadhar,
        dob,
        gender,
        password,
        role: "Doctor",
        doctorDepartment,
        docAvatar: {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
        },
    });

    res.status(200).json({
        success: true,
        message: "New Doctor Registered",
        doctor,
    });


});