<?php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Astromarg Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="admin.css">
</head>
<body>
    <div class="admin-layout">
        <aside class="sidebar">
            <h2>Astromarg</h2>
            <button class="nav-btn active" data-target="settings">Site Settings</button>
            <button class="nav-btn" data-target="blogs">Blog Posts</button>
            <button class="nav-btn logout-btn" id="logoutBtn">Logout</button>
        </aside>
        
        <main class="main-content">
            <!-- Settings Tab -->
            <section id="settings" class="tab-content active">
                <h1>Site Settings</h1>
                <form id="settingsForm">
                    <div class="settings-grid">
                        <div class="form-group">
                            <label>WhatsApp Number (include country code)</label>
                            <input type="text" id="whatsapp" required>
                        </div>
                        <div class="form-group">
                            <label>Email Address</label>
                            <input type="email" id="email" required>
                        </div>
                        <div class="form-group">
                            <label>Facebook URL</label>
                            <input type="text" id="social_facebook">
                        </div>
                        <div class="form-group">
                            <label>Instagram URL</label>
                            <input type="text" id="social_instagram">
                        </div>
                        <div class="form-group">
                            <label>YouTube URL</label>
                            <input type="text" id="social_youtube">
                        </div>
                        <div class="form-group">
                            <label>Twitter URL</label>
                            <input type="text" id="social_twitter">
                        </div>
                    </div>
                    <div class="form-group" style="margin-top: 15px;">
                        <label>Business Address</label>
                        <textarea id="address" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-save">Save Settings</button>
                    <span id="settingsStatus" style="margin-left: 15px; color: #10b981;"></span>
                </form>
            </section>

            <!-- Blogs Tab -->
            <section id="blogs" class="tab-content">
                <div class="blog-header">
                    <h1>Blog Posts</h1>
                    <button class="btn btn-add" id="openBlogModal">Add New Blog</button>
                </div>
                <ul class="blog-list" id="blogList">
                    <!-- Populated by JS -->
                </ul>
            </section>
        </main>
    </div>

    <!-- Blog Modal -->
    <div class="modal" id="blogModal">
        <div class="modal-content">
            <h3 id="modalTitle">Add Blog Post</h3>
            <form id="blogForm">
                <input type="hidden" id="blogId">
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" id="blogTitle" required>
                </div>
                <div class="form-group">
                    <label>Content (HTML supported)</label>
                    <textarea id="blogContent" style="min-height: 200px;" required></textarea>
                </div>
                <div class="form-group">
                    <label>Image URL (Optional)</label>
                    <input type="text" id="blogImage">
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-cancel" id="closeBlogModal">Cancel</button>
                    <button type="submit" class="btn">Save Blog</button>
                </div>
            </form>
        </div>
    </div>

    <script src="admin.js"></script>
</body>
</html>
