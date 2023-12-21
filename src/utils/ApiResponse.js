class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.status = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }

//   setSuccess(data, message) {
//     this.status = 200;
//     this.message = message;
//     this.data = data;
//   }

//   setError(status, message) {
//     this.status = status;
//     this.message = message;
//     this.data = {};
//   }

//   send(res) {
//     res.status(this.status).json({
//       message: this.message,
//       data: this.data,
//     });
//   }
}
