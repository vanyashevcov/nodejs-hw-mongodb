import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getContactsController,
  getContactByIdController,
  addContactsController,
  patchContactController,
  deleteContactByIdController,
} from '../controllers/contacts.js';
import { validateBody } from '../utils/validateBody.js';
import {
  contactAddSchema,
  contactUpdateSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getContactsController));

contactsRouter.get('/:id', isValidId, ctrlWrapper(getContactByIdController));

contactsRouter.post(
  '/',
  validateBody(contactAddSchema),
  ctrlWrapper(addContactsController),
);

contactsRouter.patch('/:id', isValidId, validateBody(contactUpdateSchema), ctrlWrapper(patchContactController));

contactsRouter.delete('/:id', isValidId, ctrlWrapper(deleteContactByIdController));

export default contactsRouter;
