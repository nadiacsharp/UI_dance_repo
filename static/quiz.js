$(document).ready(function(){
    
    fetch(`/quiz/${questionId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('quiz data not found');
        }
        return response.json();
    })
    displayQuizContent(questionId);
    $("#continue-btn").click(function(e){
        getChecked(questionId);
        getNext();
    });
})

async function getNext() {
    try {
        const nextQuestionId = questionId + 1;
        if (nextQuestionId > 4) {
            window.location.href = '/';
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
    else if(questionId<=3){
        document.getElementById("continue-btn").innerHTML = "Question " + quizinfo[questionId]["next_q"].toString(); 
        const $makeMedia = $("<div>")
        document.getElementById('quizName').innerHTML = quizinfo[questionId]["quizName"];
        document.getElementById('quizDescription').innerHTML = quizinfo[questionId]["quizDescription"];
        $("#vid").html(quizinfo[questionId]["video"]);
        document.getElementById('graph').innerHTML = createPattern();
        document.getElementById('checkboxes').innerHTML = createBoxes();
        console.log(quizinfo[questionId-1])

    }
    else{
        document.getElementById("continue-btn").innerHTML = "Home"
        document.getElementById('quizName').innerHTML = "Quiz Results"

        allinfo = quizinfo
        // console.log("ALL: ", allinfo[1])
        let pls = getScore(allinfo)
        console.log("SCOREEEEE: ", pls)
        
        document.getElementById('quizDescription').innerHTML = pls + "/3 Questions Correct"
    }
}

function createPattern() {
    const repeat = 7;
    let html = '';
    html+= '<div class="col first"><span class="vertical-line"></span></div>'
    for (let i = 0; i < repeat; i++) {
        html += `
            <div class="col align-self-center">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
            <div class="col pad"><span class="vertical-line"></span></div>
        `;
    }
    // html+= 
    return html;
}

function createBoxes() {
    const repeat = 8;
    let html = '';
    html+='<div class="col first pd"><input type="checkbox" id="box1" name="box" "></div>'
    for (let i = 1; i < repeat; i++) {
        const boxId = "box" + (i + 1).toString(); // Incrementing ID number
        html += `
            <div class="col">
                <span class="invis"></span>
                <span class="invis"></span>
                <span class="invis"></span>
            </div>
            <div class="col pd"><input type="checkbox" id="box${i + 1}" name="box" ></div>
        `;
    }
    // html += ``; // Last checkbox with incremented ID

    
    return html;
}


// see which boxes are checked and push user response to server
function getChecked(questionId){
    let checkboxes = document.getElementsByName('box');
    let answers = [];
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            console.log(typeof checkboxes[i].id)
            answers.push(checkboxes[i].id)
        }
    }
    console.log("ALL CHECKED: ", answers)
    saveAnswer(questionId, answers)

    //make sure server.py is updated
    console.log(quizinfo[questionId])
    console.log(quizinfo[questionId-1])

}

function saveAnswer(id, ans){
    var toSave = {"id": id, "answers": ans}
    $.ajax({
        type: "POST",
        url: "/submit_answer",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(toSave),
        success: function(result){
            console.log("SUCCESS: ", result["data"])
        },
        error: function(error){
            console.log("error: ", error)
        }
    });
}

function getScore(info){
    console.log("in func")
    console.log(info[1]["userResponse"])
    var score = 0; 
    var len = Object.keys(info).length; 
    for(var i = 1; i<len; i++){
        let idstr = i //.toString()
        console.log("USER REPS: ", info[idstr]["userResponse"])
        console.log("USER check: ", info[idstr]["ans_key"])
        if(JSON.stringify(info[idstr]["userResponse"]) === JSON.stringify(info[idstr]["ans_key"])){
            score = score + 1; 
        }
    }

    return score; 
}
