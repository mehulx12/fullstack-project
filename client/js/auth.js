const API_URL = 'http://localhost:5000/api';

function toggleAuth() {
    document.getElementById('login-form').classList.toggle('hidden');
    document.getElementById('register-form').classList.toggle('hidden');
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('user', JSON.stringify(data));
            if (data.role === 'INSTRUCTOR') window.location.href = 'instructor.html';
            else window.location.href = 'student.html';
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (err) { console.error(err); alert('Server Error'); }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });
        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('user', JSON.stringify(data));
            if (data.role === 'INSTRUCTOR') window.location.href = 'instructor.html';
            else window.location.href = 'student.html';
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (err) { console.error(err); alert('Server Error'); }
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Protect Routes
function checkAuth(role) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) window.location.href = 'index.html';
    if (role && user.role !== role) {
        alert('Unauthorized!');
        window.location.href = 'index.html';
    }
    return user;
}
