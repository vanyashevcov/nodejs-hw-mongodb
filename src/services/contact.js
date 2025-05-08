import ContactCollection from '../db/models/Contact.js';
import { sortList } from '../constants/index.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = sortList[0],
  filters = {},
}) => {
  const skip = (page - 1) * perPage;
  const contactQuery = ContactCollection.find({ userId: filters.userId });

  if (filters.userId) {
    contactQuery.where('userId').equals(filters.userId);
  }

  if (filters.type) {
    contactQuery.where('contactType').equals(filters.type);
  }

  if (filters.isFavourite) {
    contactQuery.where('isFavourite').equals(filters.isFavourite);
  }
  
  const totalItems = await ContactCollection.find({ userId: filters.userId })
    .merge(contactQuery)
    .countDocuments();

  const data = await contactQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder })
    .merge(contactQuery);

  const paginationData = calcPaginationData({ page, perPage, totalItems });

  return {
    data,
    page,
    perPage,
    totalItems,
    ...paginationData,
  };
};

export const getContactById = (contactId, userId) =>
  ContactCollection.findOne({ _id: contactId, userId });

export const addContact = (data) => ContactCollection.create(data);

export const updateContact = async ({contactId, userId}, data, options = {}) => {
  const { upsert = false } = options;
  const rawResult = await ContactCollection.findOneAndUpdate(
    { _id: contactId, userId },
    data,
    {
      upsert,
      includeResultMetadata: true,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject.upserted),
  };
};

export const deleteContactById = (contactId, userId) =>
  ContactCollection.findOneAndDelete({ _id: contactId, userId });
