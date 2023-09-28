from flask import Flask, request, jsonify

import platform

from translate import Translator

from flask_cors import CORS


app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


@app.route('/', methods=['POST', 'GET'])
async def fill_form_route():
    data = request.get_json()
    t = data.get('text')
    print(t)
    s = data.get('language')
    print(s)
    f = data.get('lang1')

    async def process_text(input_text: str, language: str):

        translator = Translator(from_lang=s, to_lang=f)
        translated_text = translator.translate(
            str(input_text))
        x = translated_text
        print(x)
        return x


    translated_result = await process_text(t, language=s)
    return translated_result
if __name__ == '__main__':
    app.run(port=8000, debug=True)
