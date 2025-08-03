from flask import Flask, request, jsonify

app = Flask(__name__)

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