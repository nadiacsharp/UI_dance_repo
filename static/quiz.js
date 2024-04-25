$(document).ready(function(){
    
    fetch(`/quiz/${questionId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('quiz data not found');
        }
        return response.json();
    })
    displayQuizContent(questionId);
    $("#continue").click(function(e){
        getChecked(questionId);
        getNext();
    });
})

async function getNext() {
    try {
        const nextQuestionId = questionId + 1;
        if (nextQuestionId > 3) {
            window.location.href = '/quiz/results';
        } else {
            window.location.href = '/quiz/' + nextQuestionId;
        }
    } catch (error) {
        console.error('Error:', error);
        throw error; 
    }
}

function displayQuizContent(questionId) {
    if(questionId==0){
        console.log("quiz id: ", questionId)
        document.getElementById('quizName').innerHTML = quizinfo[0]["quizName"];
        document.getElementById('quizDescription').innerHTML = quizinfo[0]["quizDescription"];
    }
    else{
        document.getElementById("continue").innerHTML = "Question " + quizinfo[questionId]["next_q"].toString(); 
        const $makeMedia = $("<div>")
        document.getElementById('quizName').innerHTML = quizinfo[questionId]["quizName"];
        document.getElementById('quizDescription').innerHTML = quizinfo[questionId]["quizDescription"];
        $("#vid").html(quizinfo[questionId]["video"]);
        document.getElementById('graph').innerHTML = createPattern();
        document.getElementById('checkboxes').innerHTML = createBoxes();

    }
}

function createPattern() {
    const repeat = 7;
    let html = '';
    for (let i = 0; i < repeat; i++) {
        html += `
            <div class="col">
                <span class="vertical-line"></span>
            </div>
            <div class="col">
                <span class="dot"></span>
            </div>
            <div class="col">
                <span class="dot"></span>
            </div>
            <div class="col">
                <span class="dot"></span>
            </div>
        `;
    }
    html+= '<div class="col"><span class="vertical-line"></span></div>'
    return html;
}

function createBoxes() {
    const repeat = 7;
    let html = '';
    for (let i = 0; i < repeat; i++) {
        const boxId = "box" + (i + 1).toString(); // Incrementing ID number
        html += `
            <div class="col pd">
                <input type="checkbox" id="${boxId}" name="box" value="Bike">
            </div>
            <div class="col pd">
            </div>
            <div class="col pd">
            </div>
            <div class="col pd">
            </div>
        `;
    }
    html += `<div class="col pd"><input type="checkbox" id="box${repeat + 1}" name="box" value="Bike"></div>`; // Last checkbox with incremented ID

    
    return html;
}


// see which boxes are checked and push user response to server
function getChecked(questionId){
    let checkboxes = document.getElementsByName('box');
    let result = [];
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            console.log(checkboxes[i])
            result.push(checkboxes[i])
        }
    }

    quizinfo[questionId]["userResponse"] = result; 

    //make sure server.py is updated
    // console.log(quizinfo[questionId])

}
