import { Schema, model } from 'mongoose';
import { typeList } from '../../constants/contacts.js';
import { handleSaveError, setUpdateSettings } from './hooks.js';

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: String,
  isFavourite: {
    type: Boolean,
    default: false,
  },
  contactType: {
    type: String,
    enum: typeList,
    required: true,
    default: typeList[2],
  },
}, { versionKey: false, timestamps: true });

contactSchema.post('save', handleSaveError);  

contactSchema.pre('findOneAndUpdate', setUpdateSettings);  

contactSchema.post('findOneAndUpdate', handleSaveError);  

export const contactSortFields = ['name', 'phoneNumber', 'email', 'isFavourite', 'contactType'];

const ContactCollection = model('contact', contactSchema);

export default ContactCollection;
