$(document).ready(function(){
    fetch(`/stepLesson/${lessonId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Lesson data not found');
        }
        return response.json();
    })
    .then(lesson => {
        displayLessonContent(lesson); // Call a function to display lesson content
    })
    .catch(error => {
        console.error('Error fetching lesson data:', error);
    });
    $("#continue-btn").click(function(e){
        getNext();
    });
})

async function getNext() {
    try {
        const response = await fetch('/maxStep'); 
        const data = await response.json(); 
        const nextLessonId = lessonId + 1;
        console.log(data);
        if (nextLessonId > data) {
            window.location.href = '/quiz/0';
        } else {
            window.location.href = '/step/' + nextLessonId;
        }
    } catch (error) {
        console.error('Error:', error);
        throw error; 
    }
}

function displayLessonContent(lesson) {
    console.log("lesson: ", lesson)
    document.getElementById('lessonName').innerHTML = "Lesson " + lesson["id"] + ": " + lesson["name"];
    document.getElementById('lessonDescription').innerHTML = lesson["description"]
    document.getElementById('lessonContent').innerHTML = lesson["content"];
    $("#vid").html(lesson["vid"]);
}
