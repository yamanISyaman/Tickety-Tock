document.addEventListener("DOMContentLoaded", function() {

    // Attach the submitForm function to the form's submit event
    var btn = document.querySelector('.sub-btn');
    btn.addEventListener('click', submitForm);
});


// Function to handle form submission
function submitForm() {

 // Get the input field value
 var inputValue = document.querySelector('.sub-input').value;


    let lang = document.documentElement.lang;
    
    fetch(`/${lang}/subscribe`, {
        method: 'POST',
        body: JSON.stringify({
            email: inputValue,
        })
    })
    .then(response => response.json())
    .then(result => {
        showMessage(result.message, result.status)
    })
}


function showMessage(message, status) {
    var div = document.querySelector('.sub-message');
    div.innerHTML = '';
    var newDiv = document.createElement('div');
    newDiv.className = `alert alert-${status}`;
    newDiv.setAttribute('role', 'alert');
    newDiv.textContent = message;
    div.appendChild(newDiv);
}
