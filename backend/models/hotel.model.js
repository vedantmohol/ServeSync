import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  tableId: {
    type: String,
    unique: true,
    required: true,
  },
  isPremium: {
    type: String,
    enum: ["Yes", "No"],
    default: "No",
  },
  isBooked: {
    type: String,
    enum: ["Yes", "No"],
    default: "No",
  },
  capacity: {
    type: Number,
    default: 2,
  },
  charges: {
    type: Number,
  }
}, { _id: false });

const floorSchema = new mongoose.Schema({
  floorId: {
    type: String,
    required: true,
    unique: true,
  },
  tables: [tableSchema]
}, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    orderType: {
      type: String,
      enum: ["Offline", "Online"],
      default: "Offline",
    },
    staffId: { type: String, required: true },
    floorId: { type: String, default: null },
    tableId: { type: String, default: null },
    kitchenId: { type: String, required: true },
    items: [
      {
        foodName: { type: String },
        quantity: { type: Number },
        amount: { type: Number },
      },
    ],
    totalAmount: { type: Number, required: true },
  },
);

const billSchema = new mongoose.Schema(
  {
    billNo: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    subTotal: { type: Number, required: true },
    gst: { type: Number, required: true },
    sgst: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    paymentMode: {
      type: String,
      enum: ["Cash", "Card", "UPI"],
      required: true,
    },
  },
  { _id: false }
);

const hotelSchema = new mongoose.Schema({
  adminName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  adminEmail: {
    type: String,
    unique: true,
    required: true,
  },
  hotelName: {
    type: String,
    required: true,
  },
  hotelType: {
    type: String,
    enum: ["veg", "non-veg", "veg-nonveg"],
    required: true,
  },
  hotelAddress: {
    type: String,
    required: true,
  },
  hotelPassword: {
    type: String,
    required: true,
  },
  hotelPhoto: {
    type: String,
    default: "https://iadairport.com/images/default-resturant.jpg",
  },
  numberOfKitchens: {
    type: Number,
    default: 0,
  },
  kitchens: [String],
  numberOfChefs: {
    type: Number,
    default: 0,
  },
  numberOfWaiters: {
    type: Number,
    default: 0,
  },
  numberOfHallManagers: {
    type: Number,
    default: 0,
  },
  chefs: [
    {
      name: String,
      email: String,
      phone: String,
      staffID: String,
      kitchenId: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  hallManagers: [
    {
      name: String,
      email: String,
      phone: String,
      staffID: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  waiters: [
    {
      name: String,
      email: String,
      phone: String,
      staffID: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  numberOfFloors: {
    type: Number,
    default: 0,
  },
  floors: [floorSchema],
  orders: [orderSchema],
  bills: [billSchema],
  totalRevenue: {
    totalAmount: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
  },
  hotelId: {
    type: String,
    unique: true,
    default: () => {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const shortId = Array.from({ length: 2 }, () =>
        letters.charAt(Math.floor(Math.random() * letters.length))
      ).join("");
      return `${yyyy}${mm}${dd}${shortId}`;
    },
  },
});

const Hotel = mongoose.model("Hotel",hotelSchema);
export default Hotel;