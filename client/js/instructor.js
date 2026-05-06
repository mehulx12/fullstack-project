const user = checkAuth('INSTRUCTOR');

document.addEventListener('DOMContentLoaded', loadCourses);

async function createCourse(e) {
    e.preventDefault();
    const title = document.getElementById('course-title').value;
    const description = document.getElementById('course-desc').value;
    const startDate = document.getElementById('course-date').value;

    try {
        const res = await fetch(`${API_URL}/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ title, description, startDate })
        });

        if (res.ok) {
            alert('Course Created Successfully!');
            e.target.reset();
            loadCourses();
        } else {
            alert('Failed to create course');
        }
    } catch (err) { console.error(err); }
}

async function loadCourses() {
    const list = document.getElementById('courses-list');
    try {
        const res = await fetch(`${API_URL}/courses/my`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const courses = await res.json();

        if (courses.length === 0) list.innerHTML = '<div class="empty-state">No courses created yet.</div>';
        else {
            list.innerHTML = courses.map(c => `
                <div class="course-item">
                    <h4>${c.title}</h4>
                    <p>${c.description}</p>
                    <small>Starts: ${new Date(c.startDate).toLocaleDateString()}</small>
                    <button class="btn-secondary" onclick="viewEnrollments('${c._id}')" style="margin-top:auto;">View Students</button>
                    <div id="enrollments-${c._id}" class="enrollments-container"></div>
                </div>
            `).join('');
        }
    } catch (err) { console.error(err); }
}

async function viewEnrollments(courseId) {
    const container = document.getElementById(`enrollments-${courseId}`);
    try {
        const res = await fetch(`${API_URL}/enrollments/course/${courseId}`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const enrollments = await res.json();

        if (enrollments.length === 0) container.innerHTML = '<div class="empty-state" style="margin-top: 1rem; padding: 1rem;">No students enrolled.</div>';
        else {
            container.innerHTML = '<ul>' +
                enrollments.map(e => `<li>${e.student.name} <span style="color:var(--text-muted);font-size:0.85em;">(${e.student.email})</span></li>`).join('') +
                '</ul>';
        }
    } catch (err) { console.error(err); }
}
