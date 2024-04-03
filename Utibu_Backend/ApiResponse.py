from flask import jsonify

class ApiResponse:
  def __init__(self, message, status_code=400):
      self.message = message
      self.status_code = status_code

  def to_dict(self):
      return {'message': self.message}

  def to_response(self):
      return jsonify(self.to_dict()), self.status_code