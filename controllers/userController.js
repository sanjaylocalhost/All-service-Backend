const User = require('../models/User');
const Booking = require('../models/Booking');

// Get User Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
    try {

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            req.body,
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get User Bookings
exports.getUserBookings = async (req, res) => {
    try {

        const bookings = await Booking.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Add Address
exports.addAddress = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);

        user.addresses.push(req.body);

        await user.save();

        res.status(200).json({
            success: true,
            message: "Address added successfully",
            data: user.addresses
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Address
exports.updateAddress = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);

        const address = user.addresses.id(req.params.addressId);

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        Object.assign(address, req.body);

        await user.save();

        res.status(200).json({
            success: true,
            message: "Address updated successfully",
            data: user.addresses
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Address
exports.deleteAddress = async (req, res) => {
    try {

        const user = await User.findById(req.user._id);

        const address = user.addresses.id(req.params.addressId);

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        address.remove();

        await user.save();

        res.status(200).json({
            success: true,
            message: "Address deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};