const Farmer = require("../Models/Farmer");
const User = require("../Models/User");

exports.saveProfile = async (req, res) => {
  try {
    const { email, userId } = req.user; // from JWT middleware
    const {
      farmName,
      fullName,
      phone,
      location,
      address,
      city,
      state,
      zipCode,
      farmSize,
      farmingType,
      yearsExperience,
      bio,
      organicCertified,
      profileImageUrl
    } = req.body;
    let image = "";
    if (req.file) {
      image = `/profiles/${req.file.filename}`;
    }

    // 2️⃣ Find farmer profile by email
    let farmer = await Farmer.findOne({ email });

    if (!farmer) {
      // Create new farmer profile
      farmer = new Farmer({
        userId,
        farmName,
        fullName,
        email: email,
        phone,
        location,
        address,
        city,
        state,
        zipCode,
        farmSize,
        farmingType,
        yearsExperience,
        organicCertified,
        bio,
        image,
        status: "active"
      });

      await farmer.save();

      return res.status(200).json({
        success: true,
        message: "Profile created successfully",
        profile: farmer,
      });
    }

    // 3️⃣ Compare incoming data with existing data
    const isUnchanged =
      farmer.farmName === farmName &&
      farmer.fullName === fullName &&
      farmer.phone === phone &&
      farmer.location === location &&
      farmer.address === address &&
      farmer.city === city &&
      farmer.state === state &&
      farmer.zipCode === zipCode &&
      farmer.farmSize === farmSize &&
      farmer.farmingType === farmingType &&
      farmer.yearsExperience === yearsExperience &&

      farmer.bio === bio
      ;

    if (isUnchanged) {
      // Nothing changed
      return res.status(200).json({
        success: true,
        message: "Profile already up to date",
        profile: farmer,
      });
    }

    // 4️⃣ Update profile if changed
    // 4️⃣ Update profile safely
    if (fullName !== undefined) farmer.fullName = fullName;
    if (farmName !== undefined) farmer.farmName = farmName;
    if (phone !== undefined) farmer.phone = phone;
    if (location !== undefined) farmer.location = location;
    if (address !== undefined) farmer.address = address;
    if (city !== undefined) farmer.city = city;
    if (state !== undefined) farmer.state = state;
    if (zipCode !== undefined) farmer.zipCode = zipCode;
    if (farmSize !== undefined) farmer.farmSize = farmSize;
    if (yearsExperience !== undefined) farmer.yearsExperience = yearsExperience;
    if (farmingType !== undefined) farmer.farmingType = farmingType;
    if (bio !== undefined) farmer.bio = bio;
    if (organicCertified !== undefined) farmer.organicCertified = organicCertified;

    if (image) farmer.image = image;

    await farmer.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: farmer,
    });

  } catch (error) {
    console.error("Save Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while saving profile",
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { email } = req.user;

    const farmer = await Farmer.findOne({ email });

    return res.status(200).json({
      success: true,
      profile: farmer || null,
      profileCompleted: !!farmer,
      message: "Fetch successfully",
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    });
  }
};
