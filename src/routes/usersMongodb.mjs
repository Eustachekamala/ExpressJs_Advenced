import router from './usersRouter.mjs';
import { checkSchema } from 'express-validator';
import { createUserValidatorSchema } from '../validators/validatorSchemas.mjs';
import { createUserHandler } from '../handlers/users.mjs';

router.post("/api/users", checkSchema(createUserValidatorSchema), createUserHandler)

export default router;