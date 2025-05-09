import createHttpError from 'http-errors';
import {
  addContact,
  deleteContactById,
  getContactById,
  getContacts,
  updateContact,
} from '../services/contact.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { contactSortFields } from '../models/Contact.js';
import { parseContactFilterParams } from '../utils/filters/parseContactFilterParams.js';
import { saveFile } from '../utils/saveFile.js';

export const getContactsController = async (req, res) => {
  const paginationParams = parsePaginationParams(req.query);
  const sortParams = parseSortParams(req.query, contactSortFields);
  const filters = parseContactFilterParams(req.query);
  filters.userId = req.user._id;

  const data = await getContacts({
    ...paginationParams,
    ...sortParams,
    filters,
  });

  res.status(200).json({
    status: 200,
    message: `Successfully found contacts!`,
    data,
  });
};

export const getContactsByIdController = async (req, res) => {
  const contactId = req.params.contactId;
  const { _id: userId } = req.user;
  const data = await getContactById(contactId, userId);

  if (!data) {
    throw createHttpError(404, `Contact with id=${contactId} not found`);
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data,
  });
};

export const addContactController = async (req, res) => {
  const { _id: userId } = req.user;

  let photo = null;
  if (req.file) {
    photo = await saveFile(req.file);
  }

  const data = await addContact({ ...req.body, userId, photo });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const upsertContactController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const { data, isNew } = await updateContact({ contactId, userId }, req.body, {
    upsert: true,
  });
  const status = isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Successfully updated contact',
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  const data = await getContactById(contactId, userId);

  if (!data) {
    throw createHttpError(404, `Contact with id=${contactId} not found`);
  }

  let photo = data.photo;
  if (req.file) {
    photo = await saveFile(req.file);
  }

  const result = await updateContact(
    { contactId, userId },
    { ...req.body, photo },
  );

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.data,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const data = await deleteContactById(contactId, userId);

  if (!data) {
    throw createHttpError(404, `Contact with id=${contactId} not found`);
  }

  res.status(204).send();
};