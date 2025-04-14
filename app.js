


const en = "https://raw.githubusercontent.com/aliendevuz/quiz_web/refs/heads/master/strings/en.json";
const uz = "https://raw.githubusercontent.com/aliendevuz/quiz_web/refs/heads/master/strings/uz.json";

fetch(en)
.then(response => response.json())
.then(response => {
    console.log(response);
})
