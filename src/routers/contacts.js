import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getContactsController,
  getContactByIdController,
  addContactsController,
  patchContactController,
  deleteContactByIdController,
} from '../controllers/contacts.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getContactsController));

contactsRouter.get('/:id', ctrlWrapper(getContactByIdController));

contactsRouter.post('/', ctrlWrapper(addContactsController));

contactsRouter.patch('/:id', ctrlWrapper(patchContactController));

contactsRouter.delete('/:id', ctrlWrapper(deleteContactByIdController));

export default contactsRouter;
