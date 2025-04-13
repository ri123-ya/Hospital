export const catchAsyncErrors = (theFunction) => {
    return (req, res, next) => {
        Promise.resolve(theFunction(req, res, next)).catch(next);
    };
};

/*Takes the controller function -> return the function that express can understand -> it wraps the function around Promise.resolve(.....).catch(next) -> if there is an error it passes it to the express error handler */