const login = document.getElementById('login')



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

        if (response.redirected) {
            
            return window.location.href = 'dashboard.html';
        }

        const message = await response.text();
        alert(message)
    } catch (error) {
        
        alert(error);
    }
};
    
    

