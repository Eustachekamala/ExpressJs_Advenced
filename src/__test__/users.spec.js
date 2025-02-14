import { getUserByIdHandler, createUserHandler } from "../handlers/users.mjs";
import { users } from "../utils/constants.mjs";

jest.mock('express-validator', () => ({
    validationResult: jest.fn(() => ({
        isEmpty: jest.fn(() => false),
        array: jest.fn(() => [{msg: "Invalid Field"}]),
    }))
}))

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
    const  mockRequest = {
        findUserIndex : 1,
    }
    it('Should return a status of 400', async () => {
       await createUserHandler(mockRequest, mockResponse)

       // Add assertions to verify the behavior
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith([{ msg: "Invalid Field" }]);
    })
})