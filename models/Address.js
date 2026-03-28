// backend/models/Address.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  addressName: {
    type: String,
    required: [true, 'Address name is required'],
    trim: true,
    enum: ['Home', 'Office', 'Other']
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Please enter valid 10-digit phone number']
  },
  streetAddress: {
    type: String,
    required: [true, 'Street address is required'],
    trim: true
  },
  landmark: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  pincode: {
    type: String,
    required: [true, 'Pincode is required'],
    match: [/^[0-9]{6}$/, 'Please enter valid 6-digit pincode']
  },
  country: {
    type: String,
    default: 'India'
  },
  addressType: {
    type: String,
    enum: ['home', 'work', 'other'],
    default: 'home'
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  formattedAddress: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for geospatial queries
addressSchema.index({ location: '2dsphere' });
addressSchema.index({ user: 1, isDefault: 1 });

// Middleware to ensure only one default address per user
addressSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

// Method to get formatted address
addressSchema.methods.getFullAddress = function() {
  return `${this.streetAddress}, ${this.landmark ? this.landmark + ', ' : ''}${this.city}, ${this.state} - ${this.pincode}`;
};

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;