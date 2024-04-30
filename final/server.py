from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
import json, data_manager
app = Flask(__name__)

quizinfo = {
   "0":{
      "id": 0, 
      "quizName": "QUIZ",
      "quizDescription": "Let's see if you have found your style by taking this short quiz!",
      "video": "",
      "userResponse": [],
      "next_q": "1"
   },
   "1":{
      "id": 1, 
      "quizName": "Question 1",
      "quizDescription": "On what counts are the accents of this song? Mark the corresponding boxes",
      "video": "<iframe width='560' height='315' src='https://www.youtube.com/embed/eHqiwNCSKEE?si=351jRuQBVigtKZx2&amp;clip=UgkxoTbVYv0xdbYhfRElyrcnMCRlVk-eZLVI&amp;clipt=ELDhBBjArwU' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;' referrerpolicy='strict-origin-when-cross-origin' allowfullscreen></iframe>",
      "userResponse": [],
      "ans_key": ['box2', 'box4', 'box6', 'box8'],
      "next_q": "2"
   },
   "2":{
      "id": 2, 
      "quizName": "Question 2",
      "quizDescription": "When you count in a tempo that is double time, what counts are the accents of this song? Mark the corresponding boxes",
      "video": "<iframe width='560' height='315' src='https://www.youtube.com/embed/eHqiwNCSKEE' title='YouTube video player'' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' allowfullscreen></iframe>",
      "userResponse": [],
      "ans_key": ['box3', 'box7'],
      "next_q": "3"
   },
   "3":{
      "id": 3, 
      "quizName": "Question 3",
      "quizDescription": "When you count in a tempo that is half time, what counts are the accents of this song?",
      "video": "<iframe width='560' height='315' src='https://www.youtube.com/embed/eHqiwNCSKEE?si=rthflookxj6BiR1j&amp;controls=0&amp;start=78' title='YouTube video player'' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' allowfullscreen></iframe>",
      "userResponse": [],
      "ans_key": ['box1','box2', 'box3', 'box4', 'box5', 'box6', 'box7', 'box8'],
      "next_q": "results"
   },
}


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
   return render_template('quiz.html', questionId=questionId, quizinfo=quizinfo)

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

@app.route('/submit_answer', methods=['GET', 'POST'])
def submit_answer():
   global quizinfo

   json_data = request.get_json()
   id = json_data["id"]
   answers = json_data["answers"]
   id = str(id)

   quizinfo[id]["userResponse"] = answers
   print(jsonify(quizinfo = quizinfo))
   return jsonify(quizinfo = quizinfo)



if __name__ == '__main__':
   app.run(debug = True)