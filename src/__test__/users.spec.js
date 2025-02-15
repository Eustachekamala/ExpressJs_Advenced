import { getUserByIdHandler, createUserHandler } from "../handlers/users.mjs";
import { users } from "../utils/constants.mjs";
import validator from 'express-validator';
import helpers from "../utils/helpers.mjs";
import { User } from "../mongoose/schemas/user.mjs";

jest.mock('express-validator', () => ({
    validationResult: jest.fn(() => ({
        isEmpty: jest.fn(() => false),
        array: jest.fn(() => [{msg: "Invalid Field"}]),
    })),
    matchedData: jest.fn(() => ({
        username: "test",
        password: "password",
        displayname: "test-name"
    })),
}));

jest.mock('../utils/helpers.mjs', () => ({
    hashPassword: jest.fn((password) => `hashed_${password}`),
}));

jest.mock('../mongoose/schemas/user.mjs')

const mockRequest = {
    findUserIndex: 1,
};

const mockResponse = {
    status: jest.fn().mockReturnThis(),
    sendStatus: jest.fn(),
    send : jest.fn(),
};

describe('get users', () => {
    it('should get user by id', () => {
        getUserByIdHandler(mockRequest, mockResponse);
        expect(mockResponse.send).toHaveBeenCalled();
        expect(mockResponse.send).toHaveBeenCalledWith(users[1]);
        expect(mockResponse.send).toHaveBeenCalledTimes(1);
    });

    it('should call sendStatus with 404 when user was not found', () => {
        const copyMockRequest = {...mockRequest, findUserIndex:100};
        getUserByIdHandler(copyMockRequest, mockResponse);
        expect(mockResponse.sendStatus).toHaveBeenCalled();
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
        expect(mockResponse.sendStatus).toHaveBeenCalledTimes(1);
    })
});

describe("Create users", () => {
    const  mockRequest = {}
    it('Should return a status of 400', async () => {
        await createUserHandler(mockRequest, mockResponse)
        expect(validator.validationResult).toHaveBeenCalled();
        expect(validator.validationResult).toHaveBeenCalledWith(mockRequest);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith([{msg : 'Invalid Field'}]);
    });

    it('Should return status 201 and a user created', async () =>{
        jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
            isEmpty: jest.fn(() => true),
        }));

        const savedMethod = jest.spyOn(User.prototype, "save").mockResolvedValueOnce(
            {   
                id: 1,
                username: "test",
                password: "hashed_password",
                displayname: "test-name"
            }
        );

        await createUserHandler(mockRequest, mockResponse);
        expect(validator.matchedData).toHaveBeenCalledWith(mockRequest);
        expect(helpers.hashPassword).toHaveBeenCalledWith("password");
        expect(helpers.hashPassword).toHaveBeenCalledWith("password");
        expect(User).toHaveBeenCalledWith(
            {
                username: "test",
                password: "hashed_password",
                displayname: "test-name"
            }
        );
        expect(savedMethod).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenLastCalledWith(201);
        expect(mockResponse.send).toHaveBeenCalledWith(
            {   
                id: 1,
                username: "test",
                password: "hashed_password",
                displayname: "test-name"
            }
        );
    });

    it('Should send status 400 when database fails to save user',async () => {
        jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
            isEmpty : jest.fn(() => true)
        }));

        const  savedMethod = jest
            .spyOn(User.prototype, "save")
            .mockImplementationOnce(() => Promise.reject("Faild to save user"))
        await createUserHandler(mockRequest, mockResponse);
        expect(savedMethod).toHaveBeenCalled();
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
    });
});