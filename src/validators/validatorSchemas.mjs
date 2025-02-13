export const createUserValidatorSchema = {
    username : {
        isLength : {
            options : {
                min : 5,
                max : 32
            },
            errorMessage : "Username must be at least 5 characters with a max of 32 characters"
        },
        notEmpty : {
            errorMessage : "Username cannot be empty"
        },
        isString : {
            errorMessage : "Username must be a string"
        },
    },

    displayname : {
        notEmpty : {
            errorMessage : "DisplayName cannot be empty"
        }
    },
    password : {
        notEmpty : true,
    }
};

//to GET users by params
export const getUserValidatorSchema = {
    filter : {
        isString: {
            errorMessage: "Must be a string",
        },
        notEmpty: {
            errorMessage: "Cannot be empty",
        },
        isLength: {
            options: {
                min: 3,
                max: 10,
            },
            errorMessage: "Must be at least 3-10 characters",
        },
    },
};