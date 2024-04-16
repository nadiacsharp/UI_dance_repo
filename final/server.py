from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
import json, data_manager
app = Flask(__name__)

@app.route('/')
def home():
   return render_template('home.html') 

@app.route('/beat/<int:lessonId>')
def beat(lessonId):
   return render_template('beat.html', lessonId=lessonId)

@app.route('/step/<int:lessonId>')
def step(lessonId):
   return render_template('step.html', lessonId=lessonId)

@app.route('/quiz/<int:questionId>')
def quiz(questionId):
   return render_template('quiz.html', questionId=questionId)

@app.route('/beatLesson/<lesson_id>', methods=['GET'])
def get_beatLesson(lesson_id):
   lesson = data_manager.getBeatLessonById(int(lesson_id))
   if not lesson:
      return jsonify({'error': 'Lesson not found'}), 404
   return jsonify(lesson.to_dict())

@app.route('/stepLesson/<lesson_id>', methods=['GET'])
def get_stepLesson(lesson_id):
   lesson = data_manager.getStepLessonById(int(lesson_id))
   if not lesson:
      return jsonify({'error': 'Lesson not found'}), 404
   return jsonify(lesson.to_dict())

@app.route('/maxBeat', methods = ["GET"])
def get_maxBeat():
   return jsonify(data_manager.getMaxBeat())

@app.route('/maxStep', methods = ["GET"])
def get_maxStep():
   return jsonify(data_manager.getMaxStep())

if __name__ == '__main__':
   app.run(debug = True)