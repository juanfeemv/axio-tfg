import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteConfig extends Document {
  allowRegistration: boolean;
  maintenanceMode: boolean;
  maxPinsPerProject: number;
  maxUploadMb: number;
  updatedAt: Date;
  createdAt: Date;
}

const SiteConfigSchema: Schema = new Schema(
  {
    allowRegistration: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },
    maxPinsPerProject: { type: Number, default: 100 },
    maxUploadMb: { type: Number, default: 10 }
  },
  { timestamps: true }
);

export default mongoose.model<ISiteConfig>('SiteConfig', SiteConfigSchema);
