<?php
session_start();
@include '../config/config.php';
include("func/function.php");

if (isset($_SESSION['login'])) {
    header("Location: index.php");
    exit();
}

if(isset($_POST['sbt_register'])){
    $name = $_POST['name'] ?? "";
    $password = $_POST['password'] ?? "";
    $re_password = $_POST['re_password'] ?? "";
    $email = $_POST['email'] ?? "";
    $phone_number = $_POST['phone_number'] ?? "";
    $passwordMd5 = md5($password);


    $valid = true;
        if(empty($_POST['name'])){
            $valid = false;
            $errorName = "*Vui lòng nhập họ và tên!";
        }

        if(empty($_POST['password'])){
            $valid = false;
            $errorPassword = "*Vui lòng nhập mật khẩu!";
        }elseif(strlen($password) < 6){
            $valid = false;
            $errorPassword = "*Vui lòng nhập lớn hơn 6 kí tự!";
        }

        if(empty($_POST['email'])){
            $valid = false;
            $errorEmail = "*Vui lòng nhập địa chỉ email!";
        }
        elseif(!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)){
            $valid = false;
            $errorEmail = "*Vui lòng nhập đúng định dạng email!";
        }
        
        if(empty($_POST['phone_number'])){
            $valid = false;
            $errorPhone = "*Vui lòng nhập số điện thoại!";
        }
        elseif(strlen($_POST['phone_number']) != 10 || !is_numeric($_POST['phone_number']) || $_POST['phone_number'][0] != 0){
            $valid = false;
            $errorPhone = "*Vui lòng nhập đúng định dạng số điện thoại!";
        }

        if(empty($_POST['re_password'])){
            $valid = false;
            $errorErPassword = "Vui lòng nhập lại mật khẩu";
        }elseif($password != $re_password){
            $valid = false;
            $errorErPassword = "Mật khẩu không trùng khớp";
        }
        
    if($valid){
        $select = "SELECT * FROM users WHERE email = '$email'";
        $result = mysqli_query($conn, $select);
        if(mysqli_num_rows($result) > 0){
            echo "<script>alert('Email đã tồn tại!');</script>";
        }else{
            $insert = "INSERT INTO users (username, password, email, phone_number) VALUES('$name', '$passwordMd5', '$email', '$phone_number')";
            mysqli_query($conn, $insert);
            // log activity
            $user_id = mysqli_insert_id($conn);
            // logActivity($conn, $user_id, "register", null, null, null, null, "Người dùng đăng ký tài khoản với email: $email");
            echo "<script>alert('Đăng kí thành công!');</script>";
        }
    }
    
    
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./assets/css/gd.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet"> 
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  </head>
    <title>Đăng ký</title>
    <style>
            body {
        min-height: 100vh;
        margin: 0;
        background-image: url("assets/images/bg.png");
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-attachment: fixed;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .container {
        width: 420px;
        padding: 30px 35px;
        border-radius: 14px;

        background: transparent;
        backdrop-filter: blur(30px);
        -webkit-backdrop-filter: blur(10px);

        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
        text-align: center;
    }

    .infor-box {
        background: transparent;
    }

        .error{
            color: red;
            font-size: 13px;
            margin: 5px 0px;
        }
        .error_border{
            border: none;
            border-bottom: 2px solid red;
        }

    </style>
    
</head>
<body>
    <div class="container">
        <img src="assets/images/doggle_drive.png" class="hvah" alt="">
        <div class="cttts">HỆ THỐNG QUẢN LÝ TÀI NGUYÊN SỐ</div>

        <div class="infor-box">
            <form method="post">
                <h2>ĐĂNG KÝ</h2>
                <div class="input-box <?php echo (isset($errorName)) ? 'error_border' : '';?>">
                    <span class="icon"><i class="fa-solid fa-user"></i></span>
                    <input type="text" id="name" name="name" value="<?php if(isset($_POST['name'])) {echo $_POST['name'];} ?>" >
                    <label for="">Họ và tên</label>
                </div>
                <div class="error"><?php echo (isset($errorName)) ? $errorName : "" ?></div>

                <div class="input-box <?php echo (isset($errorEmail)) ? 'error_border' : '';?>">
                    <span class="icon"><i class="fa-solid fa-envelope"></i></span>
                    <input type="email" id="email" name="email" value="<?php if(isset($_POST['email'])) {echo $_POST['email'];} ?>">
                    <label for="">Email</label>
                </div>
                <div class="error"><?php echo (isset($errorEmail)) ? $errorEmail : "" ?></div>
                
                <div class="input-box <?php echo (isset($errorPhone)) ? 'error_border' : '';?>">
                    <span class="icon"><i class="fa-solid fa-phone"></i></span>
                    <input type="tel" id="phone" name="phone_number" value="<?php if(isset($_POST['phone_number'])) {echo $_POST['phone_number'];} ?>">
                    <label for="">Số điện thoại</label>
                </div>
                <div class="error"><?php echo (isset($errorPhone)) ? $errorPhone : "" ?></div>

                <div class="input-box <?php echo (isset($errorPassword)) ? 'error_border' : '';?>">
                    <span class="icon"><i class="fa-solid fa-lock"></i></span>
                    <input type="password" id="password" name="password" value="<?php if(isset($_POST['password'])) {echo $_POST['password'];} ?>">
                    <label for="">Mật khẩu </label>
                </div>
                <div class="error"><?php echo (isset($errorPassword)) ? $errorPassword : "" ?></div>

                <div class="input-box <?php echo (isset($errorPassword)) ? 'error_border' : '';?>">
                    <span class="icon"><i class="fa-solid fa-lock"></i></span>
                    <input type="password" id="re_password" name="re_password" value="<?php if(isset($_POST['re_password'])) {echo $_POST['re_password'];} ?>">
                    <label for="">Nhập lại mật khẩu </label>
                </div>
                <div class="error"><?php echo (isset($errorErPassword)) ? $errorErPassword : "" ?></div>

                <button type="submit" name="sbt_register">Đăng ký</button>
                
                <hr>
                <p>Đã có tài khoản? <a href="./login.php">Đăng nhập</a></p>
            </form>
        </div>
        <div class="copyright">&copy;Copyright by Phanh dep try and Manh xinh gai 2025</div>
    </div>


</body>
</html>