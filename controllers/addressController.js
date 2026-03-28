// backend/controllers/addressController.js
const Address = require('../models/Address');

// @desc    Create new address
// @route   POST /api/addresses
// @access  Private
exports.createAddress = async (req, res) => {
  try {
    const { 
      addressName, fullName, phoneNumber, streetAddress, 
      landmark, city, state, pincode, addressType, 
      isDefault, coordinates 
    } = req.body;

    // Check if user already has addresses
    const addressCount = await Address.countDocuments({ user: req.user.id });
    
    // If this is the first address, make it default
    const shouldBeDefault = addressCount === 0 ? true : isDefault || false;

    // Create address object
    const addressData = {
      user: req.user.id,
      addressName,
      fullName,
      phoneNumber,
      streetAddress,
      landmark,
      city,
      state,
      pincode,
      addressType,
      isDefault: shouldBeDefault,
      formattedAddress: `${streetAddress}, ${city}, ${state} - ${pincode}`
    };

    // Add coordinates if provided
    if (coordinates && coordinates.length === 2) {
      addressData.location = {
        type: 'Point',
        coordinates: coordinates // [longitude, latitude]
      };
    }

    const address = await Address.create(addressData);

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: address
    });
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating address',
      error: error.message
    });
  }
};

// @desc    Get all addresses for a user
// @route   GET /api/addresses
// @access  Private
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id, isActive: true })
      .sort({ isDefault: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: addresses.length,
      data: addresses
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching addresses',
      error: error.message
    });
  }
};

// @desc    Get single address
// @route   GET /api/addresses/:id
// @access  Private
exports.getAddressById = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    res.status(200).json({
      success: true,
      data: address
    });
  } catch (error) {
    console.error('Get address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching address',
      error: error.message
    });
  }
};

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
exports.updateAddress = async (req, res) => {
  try {
    let address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    const { isDefault, coordinates, ...updateData } = req.body;

    // Update formatted address
    if (updateData.streetAddress || updateData.city || updateData.state || updateData.pincode) {
      updateData.formattedAddress = `${updateData.streetAddress || address.streetAddress}, ${updateData.city || address.city}, ${updateData.state || address.state} - ${updateData.pincode || address.pincode}`;
    }

    // Update coordinates if provided
    if (coordinates && coordinates.length === 2) {
      updateData.location = {
        type: 'Point',
        coordinates: coordinates
      };
    }

    // Update address
    address = await Address.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    // Handle default address update
    if (isDefault === true) {
      await Address.updateMany(
        { user: req.user.id, _id: { $ne: address._id } },
        { isDefault: false }
      );
      address.isDefault = true;
      await address.save();
    }

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: address
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating address',
      error: error.message
    });
  }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Soft delete
    address.isActive = false;
    await address.save();

    // If deleted address was default, make another address default
    if (address.isDefault) {
      const anotherAddress = await Address.findOne({
        user: req.user.id,
        _id: { $ne: address._id },
        isActive: true
      });

      if (anotherAddress) {
        anotherAddress.isDefault = true;
        await anotherAddress.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting address',
      error: error.message
    });
  }
};

// @desc    Set default address
// @route   PUT /api/addresses/:id/default
// @access  Private
exports.setDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id,
      isActive: true
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Set all addresses to non-default
    await Address.updateMany(
      { user: req.user.id },
      { isDefault: false }
    );

    // Set selected address as default
    address.isDefault = true;
    await address.save();

    res.status(200).json({
      success: true,
      message: 'Default address updated',
      data: address
    });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({
      success: false,
      message: 'Error setting default address',
      error: error.message
    });
  }
};

// @desc    Get nearby addresses based on location
// @route   GET /api/addresses/nearby?lat=12.9716&lng=77.5946&radius=5000
// @access  Private
exports.getNearbyAddresses = async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const addresses = await Address.find({
      user: req.user.id,
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    });

    res.status(200).json({
      success: true,
      count: addresses.length,
      data: addresses
    });
  } catch (error) {
    console.error('Get nearby addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby addresses',
      error: error.message
    });
  }
};