const user = checkAuth('STUDENT');

document.addEventListener('DOMContentLoaded', () => {
    loadAvailableCourses();
    loadMyEnrollments();
});

async function loadAvailableCourses() {
    const list = document.getElementById('available-list');
    try {
        const res = await fetch(`${API_URL}/courses`);
        const courses = await res.json();

        list.innerHTML = courses.map(c => {
            const startDate = new Date(c.startDate);
            const isExpired = new Date() > startDate;

            return `
                <div class="course-item">
                    <h4>${c.title}</h4>
                    <p>${c.description}</p>
                    <small>Instructor: ${c.instructor.name}</small>
                    <small class="${isExpired ? 'status-expired' : ''}">Start Date: ${startDate.toLocaleDateString()}</small>
                    ${isExpired
                    ? '<button disabled class="btn-disabled">Enrollment Closed</button>'
                    : `<button onclick="enroll('${c._id}')">Enroll Now</button>`
                }
                </div>
            `;
        }).join('');
    } catch (err) { console.error(err); }
}

async function loadMyEnrollments() {
    const list = document.getElementById('enrollments-list');
    try {
        const res = await fetch(`${API_URL}/enrollments/my`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const enrollments = await res.json();

        if (enrollments.length === 0) list.innerHTML = '<div class="empty-state">Not enrolled in any courses.</div>';
        else {
            list.innerHTML = enrollments.map(e => `
                <div class="course-item" style="border-top: 3px solid var(--success);">
                    <h4>${e.course.title}</h4>
                    <p>Instructor: ${e.course.instructor.name}</p>
                    <small class="status-success">Enrolled on: ${new Date(e.enrolledAt).toLocaleDateString()}</small>
                </div>
            `).join('');
        }
    } catch (err) { console.error(err); }
}

async function enroll(courseId) {
    if (!confirm('Are you sure you want to enroll?')) return;

    try {
        const res = await fetch(`${API_URL}/enrollments/${courseId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await res.json();

        if (res.ok) {
            alert('Enrolled Successfully!');
            loadMyEnrollments();
        } else {
            alert(data.message || 'Enrollment failed');
        }
    } catch (err) { console.error(err); alert('Server Error'); }
}
