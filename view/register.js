const register = document.getElementById('register')
const log = document.getElementById('log')

log.onclick =()=>{
    window.location.href = "index.html";
}


register.onclick = async() => {

    const fullName = document.getElementById('fullName').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const age = document.getElementById('age').value

        const data = {
        name: fullName,
        email: email,
        password: password,
        age: age
    }

    try {
        const response = await fetch('/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const message = await response.text();
        alert(message); 
    } catch (error) {
        console.error('Error:', error);
        
    }
};


