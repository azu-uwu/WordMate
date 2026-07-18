<?php
session_start();
@include '../config/config.php';
include("func/function.php");
if (!isset($_SESSION['login'])) {
    header("Location: login.php");
    exit();
}
$user_id = $_SESSION['login']['user_id'];
logActivity($conn, $user_id, "logout", null, null, null, null, "Người dùng đăng xuất khỏi hệ thống");
session_destroy();
header("Location: login.php");
?>