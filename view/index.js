const login = document.getElementById('login')
let userData;


login.onclick = async()=>{
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    const data = {
        email: email,
        password: password
    }
    
    try {
        const response = await fetch('/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            userData = await response.json();
            sessionStorage.setItem('userData', JSON.stringify(userData));
             window.location.href = `dashboard.html`
            

            
        }if(!response.ok){

        const message = await response.text();
        alert(message)
    }
    } catch (error) {
        
        alert(error);
    }
}; 

