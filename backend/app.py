import myprosody as mysp
import os
import io
import sys
from pydub import AudioSegment as am
from flask import Flask, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)

@app.route('/analyse', methods=['POST'])
@cross_origin()
def hello_world():
    file = request.files.get('file')
    val = ''
    if file:
        file_name = file.filename
        file.save(os.path.join('/Users/raunaq/Desktop/toefl/backend/myprosody/dataset/audioFiles', f'{file_name}.webm'))
        sound = am.from_file('/Users/raunaq/Desktop/toefl/backend/myprosody/dataset/audioFiles/file.webm', format='webm')
        sound = sound.set_frame_rate(48000)
        sound = sound.set_channels(32)
        sound.export('/Users/raunaq/Desktop/toefl/backend/myprosody/dataset/audioFiles/wavfile.wav', format='wav')
        p = 'wavfile'
        c = r'/Users/raunaq/Desktop/toefl/backend/myprosody'
        actual_output = sys.stdout
        sys.stdout = io.StringIO()
        print('Start')
        mysp.myprosody(p, c)
        print('End')
        val = sys.stdout.getvalue()
        start = val.index('Start') + len('Start')
        end = val.index('End')
        val = val[start:end]
        sys.stdout = actual_output
        points = val.split('\n') 
        points = filter(lambda x: 'Out' not in x and 'f0' not in x and 'f1' not in x, points)
        val = '\n'.join(points)
    
    return val
