import { User } from '../mongoose/schemas/user.mjs';
import router from './usersRouter.mjs';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import { createUserValidatorSchema } from '../validators/validatorSchemas.mjs';
import { hashPassword } from '../utils/helpers.mjs';

router.post("/api/users", checkSchema(createUserValidatorSchema), async (req, res) => {
    const result = validationResult(req);

    if(!result.isEmpty()) return res.status(400).send(result.array());

    const data = matchedData(req);
    console.log(data);
    data.password = hashPassword(data.password);
    const newUser = new User(data);
    try {
        const savedUser = await newUser.save();
        return res.status(201).send(savedUser);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
    
})

export default router;