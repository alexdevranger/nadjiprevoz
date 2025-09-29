// models/Tour.js
import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }, // kad prevoznik doda
    contactPerson: { type: String, required: true },
    contactPhone: { type: String, required: true },
    note: { type: String },
    startLocation: { type: String, required: true },
    startLocationLat: { type: Number },
    startLocationLng: { type: Number },
    endLocation: { type: String },
    endLocationLat: { type: Number },
    endLocationLng: { type: Number },
    startPoint: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], index: "2dsphere", default: [0, 0] }, // [lng, lat]
    },
    endPoint: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], index: "2dsphere", default: [0, 0] },
    },

    geometry: {
      type: {
        type: String,
        enum: ["LineString"],
        default: undefined,
      },
      coordinates: {
        type: [[Number]], // niz nizova [lng, lat]
        default: undefined,
      },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPremium: {
      type: Boolean,
      default: false, // po defaultu nije premium
    },
    premiumExpiresAt: {
      type: Date,
      default: null, // nema isteka dok se ne kupi
    },
  },
  { timestamps: true }
);

tourSchema.index({ startPoint: "2dsphere" });
tourSchema.index({ endPoint: "2dsphere" });

//Pre-save: ako imamo lat/lng a geotačke nisu setovane, popuni ih

tourSchema.pre("save", function (next) {
  if (
    this.startLocationLat != null &&
    this.startLocationLng != null &&
    (!this.startPoint ||
      !Array.isArray(this.startPoint.coordinates) ||
      (this.startPoint.coordinates[0] === 0 &&
        this.startPoint.coordinates[1] === 0))
  ) {
    this.startPoint = {
      type: "Point",
      coordinates: [this.startLocationLng, this.startLocationLat],
    };
  }

  if (
    this.endLocationLat != null &&
    this.endLocationLng != null &&
    (!this.endPoint ||
      !Array.isArray(this.endPoint.coordinates) ||
      (this.endPoint.coordinates[0] === 0 &&
        this.endPoint.coordinates[1] === 0))
  ) {
    this.endPoint = {
      type: "Point",
      coordinates: [this.endLocationLng, this.endLocationLat],
    };
  }

  next();
});

/**
 * Pre findOneAndUpdate: prihvati lat/lng iz update-a i formiraj geo tačke
 * (podržava i payload-e koji koriste $set)
 */
tourSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() || {};
  const $set = update.$set || update;

  const sLat = $set.startLocationLat ?? update.startLocationLat;
  const sLng = $set.startLocationLng ?? update.startLocationLng;
  const eLat = $set.endLocationLat ?? update.endLocationLat;
  const eLng = $set.endLocationLng ?? update.endLocationLng;

  // Ako su stigle koordinate, prepiši i geo tačke
  if (sLat != null && sLng != null && !$set.startPoint && !update.startPoint) {
    $set.startPoint ??= update.startPoint ??= {
      type: "Point",
      coordinates: [Number(sLng), Number(sLat)],
    };
    $set.startPoint.coordinates = [Number(sLng), Number(sLat)];
  }

  if (eLat != null && eLng != null && !$set.endPoint && !update.endPoint) {
    $set.endPoint ??= update.endPoint ??= {
      type: "Point",
      coordinates: [Number(eLng), Number(eLat)],
    };
    $set.endPoint.coordinates = [Number(eLng), Number(eLat)];
  }

  // vrati nazad update ($set ako je korišćen)
  if (update.$set) update.$set = $set;
  else Object.assign(update, $set);

  next();
});

export default mongoose.model("Tour", tourSchema);
