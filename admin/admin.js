document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const navBtns = document.querySelectorAll('.nav-btn[data-target]');
    const tabContents = document.querySelectorAll('.tab-content');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(btn.dataset.target).classList.add('active');
        });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        await fetch('../api/auth.php?logout=true');
        window.location.href = 'index.php';
    });

    // --- Settings Logic ---
    const loadSettings = async () => {
        const res = await fetch('../api/settings.php');
        const data = await res.json();
        if(data) {
            document.getElementById('whatsapp').value = data.whatsapp || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('address').value = data.address || '';
            document.getElementById('social_facebook').value = data.social_facebook || '';
            document.getElementById('social_instagram').value = data.social_instagram || '';
            document.getElementById('social_youtube').value = data.social_youtube || '';
            document.getElementById('social_twitter').value = data.social_twitter || '';
        }
    };

    document.getElementById('settingsForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            whatsapp: document.getElementById('whatsapp').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            social_facebook: document.getElementById('social_facebook').value,
            social_instagram: document.getElementById('social_instagram').value,
            social_youtube: document.getElementById('social_youtube').value,
            social_twitter: document.getElementById('social_twitter').value,
        };
        const res = await fetch('../api/settings.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        if(res.ok) {
            const status = document.getElementById('settingsStatus');
            status.innerText = 'Settings Saved!';
            setTimeout(() => status.innerText = '', 3000);
        }
    });

    // --- Blog Logic ---
    let blogs = [];
    const loadBlogs = async () => {
        const res = await fetch('../api/blogs.php');
        blogs = await res.json();
        renderBlogs();
    };

    const renderBlogs = () => {
        const list = document.getElementById('blogList');
        list.innerHTML = '';
        blogs.forEach(blog => {
            const li = document.createElement('li');
            li.className = 'blog-item';
            li.innerHTML = `
                <div>
                    <strong>${blog.title}</strong>
                    <div style="font-size: 0.8rem; color: #64748b; margin-top: 5px;">${new Date(blog.date).toLocaleDateString()}</div>
                </div>
                <div class="blog-item-actions">
                    <button class="btn-edit" onclick="editBlog('${blog.id}')">Edit</button>
                    <button class="btn-delete" onclick="deleteBlog('${blog.id}')">Delete</button>
                </div>
            `;
            list.appendChild(li);
        });
    };

    // Modal logic
    const modal = document.getElementById('blogModal');
    const form = document.getElementById('blogForm');
    
    document.getElementById('openBlogModal').addEventListener('click', () => {
        form.reset();
        document.getElementById('blogId').value = '';
        document.getElementById('modalTitle').innerText = 'Add Blog Post';
        modal.classList.add('active');
    });

    document.getElementById('closeBlogModal').addEventListener('click', () => {
        modal.classList.remove('active');
    });

    window.editBlog = (id) => {
        const blog = blogs.find(b => b.id === id);
        if(blog) {
            document.getElementById('blogId').value = blog.id;
            document.getElementById('blogTitle').value = blog.title;
            document.getElementById('blogContent').value = blog.content;
            document.getElementById('blogImage').value = blog.image || '';
            document.getElementById('modalTitle').innerText = 'Edit Blog Post';
            modal.classList.add('active');
        }
    };

    window.deleteBlog = async (id) => {
        if(confirm('Are you sure you want to delete this blog?')) {
            await fetch('../api/blogs.php', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id})
            });
            loadBlogs();
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            id: document.getElementById('blogId').value || undefined,
            title: document.getElementById('blogTitle').value,
            content: document.getElementById('blogContent').value,
            image: document.getElementById('blogImage').value
        };
        await fetch('../api/blogs.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        modal.classList.remove('active');
        loadBlogs();
    });

    // Init
    loadSettings();
    loadBlogs();
});
