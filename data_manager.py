import csv

class Lesson:

    beatId = -1
    stepId = -1

    def __init__(self, name, type, description, content, vid):
        if type == "beat":
            Lesson.beatId += 1
            self.id = Lesson.beatId
        else:
            Lesson.stepId += 1
            self.id = Lesson.stepId
        self.name = name
        self.type = type
        self.description = description
        self.content = content
        self.vid = vid

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "description": self.description,
            "content": self.content,
            "vid": self.vid
        }

# import data
data = []

#was giving me error so i had to put my full path - canyon 
# with open("/Users/canyon/Documents/UI_dance_repo/final/data.csv", mode='r', encoding='utf-8') as csvfile:
with open("data.csv", mode='r', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for lessonVals in reader:
        data.append(lessonVals)
beatLessons = []
stepLessons = []
for row in data:
    lesson = Lesson(row["name"], row["type"], row["description"], row["content"], row["vid"])
    if lesson.type == "beat":
        beatLessons.append(lesson)
    else: stepLessons.append(lesson)

def getBeatLessonById(id):
    for lesson in beatLessons:
        if lesson.id == id: return lesson

def getStepLessonById(id):
    for lesson in stepLessons:
        if lesson.id == id: return lesson

def getMaxStep():
    return Lesson.stepId

def getMaxBeat():
    return Lesson.beatId

