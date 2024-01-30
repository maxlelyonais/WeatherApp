fetch('../HTML/Common.html')
.then(response => response.text())
.then(data => {
    document.getElementById('commonElementsContainer').innerHTML = data;
});
