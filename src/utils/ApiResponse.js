// ApiResponse: A standard success response object for APIs
class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;     
        this.data = data;                 // actual response data
        this.message = message;           // optional success message
        this.success = statusCode < 400;  // auto-success if code < 400
    }
}

export { ApiResponse }