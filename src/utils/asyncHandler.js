// asyncHandler: Higher-order function to avoid repetitive try/catch in controllers
const asyncHandler = (requestHandler) => 
    (req, res, next) => {
        // Convert controller function to a Promise and catch errors automatically
        Promise
            .resolve(requestHandler(req, res, next))
            .catch((err) => next(err));  // Pass error to Express error middleware
    };

export { asyncHandler };


// ----------------------------------------------
// EXPLANATION OF OTHER FORMS YOU WROTE:

// const asyncHandler = () => {}                // basic function
// const asyncHandler = (func) => () => {}      // returns another function
// const asyncHandler = (func) => async () => {} // async returned function

// Full version:
// const asyncHandlerV2 = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };
