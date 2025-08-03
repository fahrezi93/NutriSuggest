from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'https://your-frontend-domain.vercel.app'], supports_credentials=True)

@app.route('/', methods=['GET'])
def root():
    return jsonify({
        'message': 'NutriSuggest API - Test Version',
        'version': '1.0',
        'status': 'running'
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'API is working!'
    })

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({
        'success': True,
        'data': 'Test endpoint working!'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 