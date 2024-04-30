$(document).ready(function(){
    let total = 0
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
        document.getElementById("continue").innerHTML = "Question " + quizinfo[questionId]["next_q"].toString(); 
        const $makeMedia = $("<div>")
        document.getElementById('quizName').innerHTML = quizinfo[questionId]["quizName"];
        document.getElementById('quizDescription').innerHTML = quizinfo[questionId]["quizDescription"];
        $("#vid").html(quizinfo[questionId]["video"]);
        document.getElementById('graph').innerHTML = createPattern();
        document.getElementById('checkboxes').innerHTML = createBoxes();
        console.log(quizinfo[questionId-1])

    }
    else{
        document.getElementById("continue").innerHTML = "Home"
        document.getElementById('quizName').innerHTML = "Quiz Results"

        allinfo = quizinfo
        // console.log("ALL: ", allinfo[1])
        let pls = getScore(allinfo)
        console.log("SCOREEEEE: ", pls)
        
        document.getElementById('quizScore').innerHTML = pls + "/3 Questions Correct"
        // document.getElementById('quizDescription').innerHTML = "Need to review anything?"
        
        
        

        // const $scoreDiv = $("<div>").text(total + "/3");


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
    let answers = [];
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            console.log(typeof checkboxes[i].id)
            answers.push(checkboxes[i].id)
        }
    }
    console.log("ALL CHECKED: ", answers)
    saveAnswer(questionId, answers)

    // $.ajax({
    //     type: "POST",
    //     url: "/submit_answer",
    //     dataType: "json",
    //     contentType: "application/json",
    //     data: JSON.stringify({"id": questionId, "answers": answers}),
    //     success: function(result){
    //         console.log("SUCCESS: ", result["data"])
    //     },
    //     error: function(error){
    //         console.log("error: ", error)
    //     }

    // });

    // quizinfo[questionId]["userResponse"] = answers; 

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
        if(info[idstr]["userResponse"].toString() === info[idstr]["ans_key"].toString()){
            score = score + 1; 
        }
    }

    return score; 
}
